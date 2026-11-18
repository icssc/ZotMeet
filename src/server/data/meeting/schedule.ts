import "server-only";

import type {
	SaveMeetingScheduleData,
	SaveMeetingScheduleResponse,
} from "@zotmeet/shared";
import { and, eq, isNull, or } from "drizzle-orm";
import { after } from "next/server";
import { db } from "@/db";
import { meetings, scheduledMeetings, users } from "@/db/schema";
import { getExistingMeeting } from "@/server/data/meeting/queries";
import { sendMeetingScheduledNotification } from "@/server/data/meeting/send-meeting-scheduled-notification";

/**
 * Saves every added and removed 15-minute block in one transaction, then (if
 * this save took the meeting from unscheduled to scheduled) emails the
 * participants once, with the host's optional message.
 *
 * Batched on purpose: when each block was its own request, the email fired on
 * the first block, before the rest were saved, so its time could be wrong.
 *
 * Not a `"use server"` module: `memberId` is taken on trust, so the caller
 * (server action or `/api` route) must authenticate it first.
 */
export async function saveMeetingScheduleForMember(
	{ meetingId, adds, removals, message }: SaveMeetingScheduleData,
	memberId: string,
): Promise<SaveMeetingScheduleResponse> {
	const meeting = await getExistingMeeting(meetingId);
	if (meeting.hostId !== memberId) {
		return { error: "Only the host can schedule this meeting." };
	}

	const flipped = await db.transaction(async (tx) => {
		if (removals.length > 0) {
			await tx
				.delete(scheduledMeetings)
				.where(
					and(
						eq(scheduledMeetings.meetingId, meetingId),
						or(
							...removals.map((block) =>
								and(
									eq(scheduledMeetings.scheduledDate, block.scheduledDate),
									eq(
										scheduledMeetings.scheduledFromTime,
										block.scheduledFromTime,
									),
									eq(scheduledMeetings.scheduledToTime, block.scheduledToTime),
								),
							),
						),
					),
				);
		}

		if (adds.length > 0) {
			await tx
				.insert(scheduledMeetings)
				.values(adds.map((block) => ({ meetingId, ...block })));
		}

		const remaining = await tx
			.select({ id: scheduledMeetings.meetingId })
			.from(scheduledMeetings)
			.where(eq(scheduledMeetings.meetingId, meetingId))
			.limit(1);

		if (remaining.length === 0) {
			await tx
				.update(meetings)
				.set({ scheduled: false })
				.where(eq(meetings.id, meetingId));
			return false;
		}

		// Returns a row only if this call flipped it (`scheduled` is nullable,
		// so unscheduled means NULL or false).
		const [row] = await tx
			.update(meetings)
			.set({ scheduled: true })
			.where(
				and(
					eq(meetings.id, meetingId),
					or(isNull(meetings.scheduled), eq(meetings.scheduled, false)),
				),
			)
			.returning({ id: meetings.id });
		return Boolean(row);
	});

	if (flipped) {
		const [hostUser] = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.memberId, memberId))
			.limit(1);

		after(() =>
			sendMeetingScheduledNotification({
				meeting,
				host: {
					id: hostUser?.id ?? memberId,
					displayName: meeting.hostDisplayName,
				},
				message,
			}).catch((err) =>
				console.error("Failed to send meeting scheduled notifications:", err),
			),
		);
	}

	return { success: true, notified: flipped };
}
