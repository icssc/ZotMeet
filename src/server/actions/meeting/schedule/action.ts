"use server";

import { and, eq, isNull, or } from "drizzle-orm";
import { after } from "next/server";
import { db } from "@/db";
import { meetings, scheduledMeetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { getExistingMeeting } from "@/server/data/meeting/queries";
import { sendMeetingScheduledNotification } from "@/server/data/meeting/send-meeting-scheduled-notification";

/** Returns the session user and meeting if the user hosts it, otherwise null. */
async function getHostedMeeting(meetingId: string) {
	const { user } = await getCurrentSession();
	if (!user) return null;
	const meeting = await getExistingMeeting(meetingId);
	if (meeting.hostId !== user.memberId) return null;
	return { user, meeting };
}

/**
 * Delete a scheduled meeting block.
 * If no blocks remain, mark meeting as unscheduled.
 */
export async function deleteScheduledTimeBlock({
	meetingId,
	scheduledFromTime,
	scheduledToTime,
	scheduledDate,
}: {
	meetingId: string;
	scheduledFromTime: string; // format "HH:mm:ss"
	scheduledToTime: string; // format "HH:mm:ss"
	scheduledDate: Date;
}) {
	try {
		if (!(await getHostedMeeting(meetingId))) {
			return { error: "Only the host can schedule this meeting." };
		}

		// Delete the specific scheduled block
		await db
			.delete(scheduledMeetings)
			.where(
				and(
					eq(scheduledMeetings.meetingId, meetingId),
					eq(scheduledMeetings.scheduledDate, scheduledDate),
					eq(scheduledMeetings.scheduledFromTime, scheduledFromTime),
					eq(scheduledMeetings.scheduledToTime, scheduledToTime),
				),
			);

		// Check if any scheduled blocks remain
		const remaining = await db
			.select()
			.from(scheduledMeetings)
			.where(eq(scheduledMeetings.meetingId, meetingId));

		// Update meetings.scheduled if no blocks remain
		if (remaining.length === 0) {
			await db
				.update(meetings)
				.set({ scheduled: false })
				.where(eq(meetings.id, meetingId));
		}

		return { success: true };
	} catch (error) {
		console.error("Error deleting scheduled meeting:", error);
		return { error: "Failed to delete scheduled meeting." };
	}
}

/**
 * Save a scheduled meeting block and update the meetings table.
 * Notifies participants when this save takes the meeting from unscheduled to scheduled.
 */
export async function saveScheduledTimeBlock({
	meetingId,
	scheduledFromTime,
	scheduledToTime,
	scheduledDate,
}: {
	meetingId: string;
	scheduledFromTime: string; // format: "HH:mm:ss"
	scheduledToTime: string; // format: "HH:mm:ss"
	scheduledDate: Date;
}) {
	try {
		const hosted = await getHostedMeeting(meetingId);
		if (!hosted) {
			return { error: "Only the host can schedule this meeting." };
		}
		const { user, meeting } = hosted;

		// Insert into scheduled_meetings table
		await db.insert(scheduledMeetings).values({
			meetingId,
			scheduledDate,
			scheduledFromTime,
			scheduledToTime,
		});

		// Mark as scheduled; returns a row only if this call flipped it
		// (`scheduled` is nullable, so unscheduled means NULL or false)
		const [flipped] = await db
			.update(meetings)
			.set({ scheduled: true })
			.where(
				and(
					eq(meetings.id, meetingId),
					or(isNull(meetings.scheduled), eq(meetings.scheduled, false)),
				),
			)
			.returning({ id: meetings.id });

		if (flipped) {
			after(() =>
				sendMeetingScheduledNotification({ meeting, host: user }).catch((err) =>
					console.error("Failed to send meeting scheduled notifications:", err),
				),
			);
		}

		return { success: true };
	} catch (error) {
		console.error("Error saving scheduled meeting:", error);
		return { error: "Failed to save scheduled meeting." };
	}
}
