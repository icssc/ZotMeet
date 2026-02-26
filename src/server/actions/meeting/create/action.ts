"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { type InsertMeeting, meetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { isUserInGroup } from "@/server/data/groups/queries";

export async function createMeetingFromData(
	meetingData: Omit<InsertMeeting, "hostId">,
	hostId: string,
): Promise<{ id: string } | { error: string }> {
	const { title, description, fromTime, toTime, timezone, dates, meetingType } =
		meetingData;

	if (!dates?.length || new Set(dates).size !== dates.length) {
		return { error: "Invalid meeting dates or times." };
	}

	const meeting: InsertMeeting = {
		title,
		description,
		fromTime,
		toTime,
		timezone,
		hostId,
		dates: dates,
		meetingType: meetingType || "dates",
	};

	try {
		const [newMeeting] = await db
			.insert(meetings)
			.values(meeting)
			.returning({ id: meetings.id });

		return { id: newMeeting.id };
	} catch (error) {
		console.error("Failed to create meeting:", error);
		return { error: "Failed to create meeting." };
	}
}

export async function createMeeting(meetingData: InsertMeeting) {
	const {
		title,
		description,
		fromTime,
		toTime,
		timezone,
		dates,
		meetingType,
		group_id,
	} = meetingData;

	const { user } = await getCurrentSession();

	if (!user) {
		return { error: "You must be logged in to create a meeting." };
	}
	const hostId = user.memberId;

	if (group_id) {
		const allowed = await isUserInGroup({ userId: user.id, groupId: group_id });
		if (!allowed) {
			return {
				error: "You do not have permission to create meetings for this group.",
			};
		}
	}

	if (!dates?.length || new Set(dates).size !== dates.length) {
		return { error: "Invalid meeting dates or times." };
	}

	const meeting: InsertMeeting = {
		title,
		description,
		fromTime,
		toTime,
		timezone,
		hostId,
		dates: dates,
		meetingType: meetingType || "dates",
		group_id: group_id ?? null,
	};

	const [newMeeting] = await db
		.insert(meetings)
		.values(meeting)
		.returning({ id: meetings.id });

	redirect(`/availability/${newMeeting.id}`);
}
