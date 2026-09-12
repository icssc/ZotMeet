"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { meetings, type SelectMeeting } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import type { MeetingMemberActionResult } from "@/server/actions/meeting/leave/action";

/**
 * Archives ("deletes") a meeting on behalf of `memberId`, who must be its
 * host. The session-reading `archiveMeeting` below and
 * `POST /api/meetings/[id]/archive` both end up here.
 */
export async function archiveMeetingForMember(
	meetingId: string,
	memberId: string,
): Promise<MeetingMemberActionResult> {
	const [meeting] = await db
		.select({ hostId: meetings.hostId })
		.from(meetings)
		.where(eq(meetings.id, meetingId))
		.limit(1);

	if (!meeting) {
		return { success: false, error: "Meeting not found." };
	}

	if (meeting.hostId !== memberId) {
		return {
			success: false,
			error: "Only meeting owner has permission to delete this meeting.",
		};
	}

	await db
		.update(meetings)
		.set({ archived: true })
		.where(eq(meetings.id, meetingId));

	return { success: true };
}

export async function archiveMeeting(
	meetingData: SelectMeeting,
): Promise<MeetingMemberActionResult> {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			success: false,
			error: "You must be logged in to delete a meeting.",
		};
	}

	return archiveMeetingForMember(meetingData.id, user.memberId);
}
