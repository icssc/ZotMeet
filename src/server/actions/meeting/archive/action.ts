"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { meetings, type SelectMeeting } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

export async function archiveMeeting(meetingData: SelectMeeting) {
	const meetingId = meetingData.id;

	const { user } = await getCurrentSession();

	if (!user) {
		return { error: "You must be logged in to delete a meeting." };
	}

	if (meetingData.hostId !== user.memberId) {
		return {
			error: "Only meeting owner has permission to delete this meeting.",
		};
	}

	await db
		.update(meetings)
		.set({ archived: true })
		.where(eq(meetings.id, meetingId));

	return { success: true };
}
