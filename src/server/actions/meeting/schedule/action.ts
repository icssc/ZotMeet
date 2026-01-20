"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { meetings, scheduledMeetings } from "@/db/schema";
import { getExistingMeeting } from "@/server/data/meeting/queries";

/**
 * Save a scheduled meeting block and update the meetings table
 */
export async function saveScheduledMeeting({
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

/**
 * Fetch scheduled blocks for a meeting from scheduled_meetings table
 */
export async function getScheduledMeetings(meetingId: string) {
	try {
		const rows = await db
			.select()
			.from(scheduledMeetings)
			.where(eq(scheduledMeetings.meetingId, meetingId));

		return rows; // array of scheduled blocks
	} catch (error) {
		console.error("Error fetching scheduled meetings:", error);
		return { error: "Failed to fetch scheduled meetings." };
	}
}

/**
 * Fetch scheduled block times from meetings table
 * (original helper for backwards compatibility)
 */
export async function getScheduledBlockTimes(meetingId: string) {
	try {
		// Fetch all scheduled blocks for this meeting
		const rows = await db
			.select()
			.from(scheduledMeetings)
			.where(eq(scheduledMeetings.meetingId, meetingId));

		if (!rows || rows.length === 0) {
			return { error: "No scheduled blocks found for this meeting" };
		}

		// Map results into a more convenient format
		const scheduledBlocks = rows.map((row) => ({
			scheduledDate: row.scheduledDate, // Date object
			scheduledFromTime: row.scheduledFromTime, // "HH:mm:ss"
			scheduledToTime: row.scheduledToTime, // "HH:mm:ss"
		}));

		return scheduledBlocks;
	} catch (error) {
		console.error("Error fetching scheduled block times:", error);
		return { error: "Failed to fetch scheduled block times." };
	}
}
