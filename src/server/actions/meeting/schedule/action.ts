"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { meetings, scheduledMeetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import {
	type FanOutOutcome,
	syncMeetingToAllMemberCalendars,
	unsyncMeetingFromAllMemberCalendars,
} from "@/lib/google-calendar/sync";
import { getExistingMeeting } from "@/server/data/meeting/queries";

export type CommitMeetingScheduleResult =
	| { success: true; outcome: FanOutOutcome; remainingBlocks: number }
	| { success: false; error: string };

export type CommitMeetingScheduleBlock = {
	scheduledDate: Date;
	scheduledFromTime: string;
	scheduledToTime: string;
};

/**
 * Atomic schedule commit for the host. Applies only the host's changes
 * (`removals`, then `additions`) to `scheduled_meetings` in a single
 * transaction, so a stale client cannot overwrite blocks it never touched.
 * It then sets `meetings.scheduled` from the remaining block count and
 * reconciles the stored schedule against every eligible member's primary
 * Google Calendar:
 *   - blocks remain   → fan-out add/update via `syncMeetingToAllMemberCalendars`
 *   - none remain     → fan-out delete via `unsyncMeetingFromAllMemberCalendars`
 *     so previously-synced events don't linger when the host unschedules.
 *
 * Fan-out runs *after* the DB transaction commits so a partial Google API
 * failure cannot roll back the local schedule.
 */
export async function commitMeetingSchedule({
	meetingId,
	additions,
	removals,
}: {
	meetingId: string;
	additions: CommitMeetingScheduleBlock[];
	removals: CommitMeetingScheduleBlock[];
}): Promise<CommitMeetingScheduleResult> {
	try {
		const { user } = await getCurrentSession();
		if (!user) {
			return {
				success: false,
				error: "You must be logged in to commit a meeting schedule.",
			};
		}

		const meeting = await getExistingMeeting(meetingId);
		if (meeting.hostId !== user.memberId) {
			return {
				success: false,
				error: "Only the meeting owner can commit a schedule.",
			};
		}

		const matchesBlock = (b: CommitMeetingScheduleBlock) =>
			and(
				eq(scheduledMeetings.meetingId, meetingId),
				eq(scheduledMeetings.scheduledDate, b.scheduledDate),
				eq(scheduledMeetings.scheduledFromTime, b.scheduledFromTime),
				eq(scheduledMeetings.scheduledToTime, b.scheduledToTime),
			);

		const remainingBlocks = await db.transaction(async (tx) => {
			await tx.execute(
				sql`select pg_advisory_xact_lock(hashtext(${meetingId}))`,
			);

			for (const b of [...removals, ...additions]) {
				await tx.delete(scheduledMeetings).where(matchesBlock(b));
			}

			if (additions.length > 0) {
				await tx.insert(scheduledMeetings).values(
					additions.map((b) => ({
						meetingId,
						scheduledDate: b.scheduledDate,
						scheduledFromTime: b.scheduledFromTime,
						scheduledToTime: b.scheduledToTime,
					})),
				);
			}

			const [{ count: remaining }] = await tx
				.select({ count: sql<number>`count(*)::int` })
				.from(scheduledMeetings)
				.where(eq(scheduledMeetings.meetingId, meetingId));

			await tx
				.update(meetings)
				.set({ scheduled: remaining > 0 })
				.where(eq(meetings.id, meetingId));

			return remaining;
		});

		let outcome: FanOutOutcome;
		try {
			outcome =
				remainingBlocks > 0
					? await syncMeetingToAllMemberCalendars(meetingId)
					: await unsyncMeetingFromAllMemberCalendars(meetingId);
		} catch (error) {
			console.error("Calendar fan-out threw after schedule commit", {
				meetingId,
				error,
			});
			outcome = {
				synced: 0,
				skipped: 0,
				failed: 1,
				errors: [{ memberId: "*", reason: "fanout_threw" }],
			};
		}

		revalidatePath(`/availability/${meetingId}`);

		return { success: true, outcome, remainingBlocks };
	} catch (error) {
		console.error("Error committing meeting schedule:", error);
		return { success: false, error: "Failed to commit meeting schedule." };
	}
}
