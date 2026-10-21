import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { availabilities, meetings } from "@/db/schema";

/**
 * The authorised core of leaving and archiving a meeting, shared by the
 * session-cookie server actions (`@actions/meeting/{leave,archive}`) and the
 * bearer-token API routes (`/api/meetings/[id]/{leave,archive}`).
 *
 * Deliberately not a `"use server"` module: every export of one of those is
 * a public endpoint, and these take `memberId` on trust — the caller is
 * responsible for having authenticated it first.
 */

export type MeetingMemberActionResult =
	| { success: true; error?: undefined }
	| { success: false; error: string };

type ActiveMeeting = {
	hostId: string;
	archived: boolean;
};

export async function fetchActiveMeeting(
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

/** Removes `memberId` from a meeting they do not host. */
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

/** Archives ("deletes") a meeting on behalf of `memberId`, who must be its host. */
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
