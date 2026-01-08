"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { type InsertMeeting, meetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

export async function editMeeting(updatedMeeting: InsertMeeting) {
	const { user } = await getCurrentSession();

	if (!user) {
		return { error: "You must be logged in to edit a meeting." };
	}

	const { title, dates, fromTime, toTime, meetingType } = updatedMeeting;

	if (new Set(dates).size !== dates?.length) {
		return { error: "Invalid meeting dates or times." };
	}

	if (!updatedMeeting.id) {
		return { error: "Meeting ID is required." };
	}

	if (updatedMeeting.hostId !== user.memberId) {
		return {
			error: "Only meeting owner has permission to edit this meeting.",
		};
	}

	await db
		.update(meetings)
		.set({
			title,
			dates,
			fromTime,
			toTime,
			meetingType,
		})
		.where(eq(meetings.id, updatedMeeting.id));

	return { success: true };
}
