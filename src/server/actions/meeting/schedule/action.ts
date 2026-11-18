"use server";

import {
	type SaveMeetingScheduleInput,
	type SaveMeetingScheduleResponse,
	saveMeetingScheduleSchema,
} from "@zotmeet/shared";
import { getCurrentSession } from "@/lib/auth";
import { saveMeetingScheduleForMember } from "@/server/data/meeting/schedule";

/**
 * Saves the host's scheduled blocks (adds and removals) in one call. Emails
 * participants, with the optional message, the first time a meeting becomes
 * scheduled. Logic lives in `saveMeetingScheduleForMember`.
 */
export async function saveMeetingSchedule(
	input: SaveMeetingScheduleInput,
): Promise<SaveMeetingScheduleResponse> {
	const { user } = await getCurrentSession();
	if (!user) return { error: "Only the host can schedule this meeting." };

	const parsed = saveMeetingScheduleSchema.safeParse(input);
	if (!parsed.success) return { error: "Invalid schedule." };

	try {
		return await saveMeetingScheduleForMember(parsed.data, user.memberId);
	} catch (error) {
		console.error("Error saving meeting schedule:", error);
		return { error: "Failed to save meeting schedule." };
	}
}
