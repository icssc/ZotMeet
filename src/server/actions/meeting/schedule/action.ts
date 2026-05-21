"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { meetings, scheduledMeetings } from "@/db/schema";
import {
	type FanOutOutcome,
	syncMeetingToAllMemberCalendars,
	unsyncMeetingFromAllMemberCalendars,
} from "@/server/actions/availability/google/calendar/action";
import { getExistingMeeting } from "@/server/data/meeting/queries";

export type CommitMeetingScheduleResult =
	| { success: true; outcome: FanOutOutcome }
	| { success: false; error: string };

export type CommitMeetingScheduleBlock = {
	scheduledDate: Date;
	scheduledFromTime: string;
	scheduledToTime: string;
};

/**
 * Atomic schedule commit for the host. Wipes and rewrites
 * `scheduled_meetings` for the meeting in a single transaction, flips the
 * `meetings.scheduled` flag, then reconciles the final schedule against
 * every eligible member's primary Google Calendar:
 *   - blocks present  → fan-out add/update via `syncMeetingToAllMemberCalendars`
 *   - blocks empty    → fan-out delete via `unsyncMeetingFromAllMemberCalendars`
 *     so previously-synced events don't linger when the host unschedules.
 *
 * Fan-out runs *after* the DB transaction commits so a partial Google API
 * failure cannot roll back the local schedule.
 */
export async function commitMeetingSchedule({
	meetingId,
	blocks,
}: {
	meetingId: string;
	blocks: CommitMeetingScheduleBlock[];
}): Promise<CommitMeetingScheduleResult> {
	try {
		await getExistingMeeting(meetingId);

		await db.transaction(async (tx) => {
			await tx
				.delete(scheduledMeetings)
				.where(eq(scheduledMeetings.meetingId, meetingId));

			if (blocks.length > 0) {
				await tx.insert(scheduledMeetings).values(
					blocks.map((b) => ({
						meetingId,
						scheduledDate: b.scheduledDate,
						scheduledFromTime: b.scheduledFromTime,
						scheduledToTime: b.scheduledToTime,
					})),
				);
			}

			await tx
				.update(meetings)
				.set({ scheduled: blocks.length > 0 })
				.where(eq(meetings.id, meetingId));
		});

		const outcome: FanOutOutcome =
			blocks.length > 0
				? await syncMeetingToAllMemberCalendars(meetingId)
				: await unsyncMeetingFromAllMemberCalendars(meetingId);

		revalidatePath(`/availability/${meetingId}`);

		return { success: true, outcome };
	} catch (error) {
		console.error("Error committing meeting schedule:", error);
		return { success: false, error: "Failed to commit meeting schedule." };
	}
}
