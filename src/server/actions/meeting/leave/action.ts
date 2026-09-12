"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { availabilities, meetings, type SelectMeeting } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

export type MeetingMemberActionResult =
	| { success: true; error?: undefined }
	| { success: false; error: string };

/** @deprecated Use {@link MeetingMemberActionResult} */
export type LeaveMeetingResult = MeetingMemberActionResult;

type ActiveMeeting = {
	hostId: string;
	archived: boolean;
};

async function fetchActiveMeeting(
	meetingId: string,
): Promise<
	{ ok: true; meeting: ActiveMeeting } | { ok: false; error: string }
> {
	const [meeting] = await db
		.select({
			hostId: meetings.hostId,
			archived: meetings.archived,
		})
		.from(meetings)
		.where(eq(meetings.id, meetingId))
		.limit(1);

	if (!meeting) {
		return { ok: false, error: "Meeting not found." };
	}

	if (meeting.archived) {
		return {
			ok: false,
			error: "This meeting is no longer available.",
		};
	}

	return { ok: true, meeting };
}

/**
 * Removes `memberId` from a meeting they do not host. The session-reading
 * `leaveMeeting` below and `POST /api/meetings/[id]/leave` both end up here.
 */
export async function leaveMeetingForMember(
	meetingId: string,
	memberId: string,
): Promise<MeetingMemberActionResult> {
	const result = await fetchActiveMeeting(meetingId);
	if (!result.ok) {
		return { success: false, error: result.error };
	}

	if (result.meeting.hostId === memberId) {
		return {
			success: false,
			error:
				"Meeting owners cannot leave their own meeting. Delete it instead.",
		};
	}

	await db
		.delete(availabilities)
		.where(
			and(
				eq(availabilities.meetingId, meetingId),
				eq(availabilities.memberId, memberId),
			),
		);

	return { success: true };
}

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
