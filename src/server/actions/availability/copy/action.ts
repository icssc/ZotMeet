"use server";

import { and, desc, eq, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { availabilities, meetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

export async function getRespondedMeetings(excludeMeetingId: string) {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			success: false,
			message: "User not logged in!",
		};
	}

	const memberId = user.memberId;
	try {
		//finds all meetingIds where user has availability row
		const respondedMeetingIds = db
			.select({ meetingId: availabilities.meetingId })
			.from(availabilities)
			.where(eq(availabilities.memberId, memberId));

		const respondedMeetings = await db
			.select({
				id: meetings.id,
				title: meetings.title,
				createdAt: meetings.createdAt,
			})
			.from(meetings)
			.where(
				and(
					eq(meetings.archived, false),
					sql`${meetings.id} IN ${respondedMeetingIds}`,
					ne(meetings.id, excludeMeetingId),
				),
			)
			.orderBy(desc(meetings.createdAt));

		return {
			success: true as const,
			meetings: respondedMeetings,
		};
	} catch (error) {
		console.error("Error fetching responded meetings: ", error);
		return {
			success: false,
			message: "Failed to fetch meetings",
		};
	}
}

export async function getUserAvailabilityForMeeting(meetingId: string) {
	const { user } = await getCurrentSession();

	if (!user) {
		return { success: false as const, message: "User not logged in" };
	}

	try {
		const availabilityData = await db.query.availabilities.findFirst({
			where: and(
				eq(availabilities.memberId, user.memberId),
				eq(availabilities.meetingId, meetingId),
			),
		});

		if (!availabilityData) {
			return { success: false as const, message: "No availability found" };
		}

		return {
			success: true as const,
			meetingAvailabilities: availabilityData.meetingAvailabilities,
		};
	} catch (error) {
		console.error("Error fetching availability:", error);
		return { success: false as const, message: "Failed to fetch availability" };
	}
}
