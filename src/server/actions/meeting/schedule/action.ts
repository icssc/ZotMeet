"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { meetings, scheduledMeetings } from "@/db/schema";
import { getExistingMeeting } from "@/server/data/meeting/queries";

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
		// Ensure the meeting exists
		const meeting = await getExistingMeeting(meetingId);
		if (!meeting) {
			return { error: "Invalid meeting ID" };
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
 * Save a scheduled meeting block and update the meetings table
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
		// Ensure the meeting exists
		const meeting = await getExistingMeeting(meetingId);
		if (!meeting) {
			return { error: "Invalid meeting ID" };
		}

		// Insert into scheduled_meetings table
		await db.insert(scheduledMeetings).values({
			meetingId,
			scheduledDate,
			scheduledFromTime,
			scheduledToTime,
		});

		// Update the meetings table to mark as scheduled
		await db
			.update(meetings)
			.set({
				scheduled: true,
			})
			.where(eq(meetings.id, meetingId));

		return { success: true };
	} catch (error) {
		console.error("Error saving scheduled meeting:", error);
		return { error: "Failed to save scheduled meeting." };
	}
}
