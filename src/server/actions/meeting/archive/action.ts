"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { meetings, type SelectMeeting } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import {
	type FanOutOutcome,
	unsyncMeetingFromAllMemberCalendars,
} from "@/server/actions/availability/google/calendar/action";

export type ArchiveMeetingResult =
	| { success: true; calendarOutcome?: FanOutOutcome; error?: undefined }
	| { success?: undefined; error: string };

export async function archiveMeeting(
	meetingData: SelectMeeting,
): Promise<ArchiveMeetingResult> {
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

	let calendarOutcome: FanOutOutcome | undefined;
	try {
		calendarOutcome = await unsyncMeetingFromAllMemberCalendars(meetingId);
		if (calendarOutcome.failed > 0) {
			console.warn("archiveMeeting: partial Google Calendar unsync", {
				meetingId,
				synced: calendarOutcome.synced,
				skipped: calendarOutcome.skipped,
				failed: calendarOutcome.failed,
				errors: calendarOutcome.errors,
			});
		}
	} catch (error) {
		console.error(
			"Failed to unsync Google Calendar events on archiveMeeting:",
			{
				meetingId,
				error,
			},
		);
	}

	return { success: true, calendarOutcome };
}
