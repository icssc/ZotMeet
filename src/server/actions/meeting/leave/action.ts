"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { availabilities, type SelectMeeting } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import {
	fetchActiveMeeting,
	leaveMeetingForMember,
	type MeetingMemberActionResult,
} from "@/server/data/meeting/member-actions";

export type { MeetingMemberActionResult };

/** @deprecated Use {@link MeetingMemberActionResult} */
export type LeaveMeetingResult = MeetingMemberActionResult;

export async function leaveMeeting(
	meetingData: SelectMeeting,
): Promise<MeetingMemberActionResult> {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			success: false,
			error: "You must be logged in to leave a meeting.",
		};
	}

	return leaveMeetingForMember(meetingData.id, user.memberId);
}

export async function removeMeetingMember(
	meetingId: string,
	targetMemberId: string,
): Promise<MeetingMemberActionResult> {
	const { user } = await getCurrentSession();

	if (!user) {
		return { success: false, error: "You must be logged in." };
	}

	const result = await fetchActiveMeeting(meetingId);
	if (!result.ok) {
		return { success: false, error: result.error };
	}

	if (result.meeting.hostId !== user.memberId) {
		return {
			success: false,
			error: "Only the meeting owner can remove members.",
		};
	}

	if (targetMemberId === user.memberId) {
		return {
			success: false,
			error: "You cannot remove yourself. Delete the meeting instead.",
		};
	}

	if (targetMemberId === result.meeting.hostId) {
		return {
			success: false,
			error: "Cannot remove the meeting host.",
		};
	}

	await db
		.delete(availabilities)
		.where(
			and(
				eq(availabilities.meetingId, meetingId),
				eq(availabilities.memberId, targetMemberId),
			),
		);

	return { success: true };
}
