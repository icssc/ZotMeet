"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { availabilities, meetings, type SelectMeeting } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

export type LeaveMeetingResult =
	| { success: true; error?: undefined }
	| { success: false; error: string };

export async function leaveMeeting(
	meetingData: SelectMeeting,
): Promise<LeaveMeetingResult> {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			success: false,
			error: "You must be logged in to leave a meeting.",
		};
	}

	const [meeting] = await db
		.select({
			hostId: meetings.hostId,
			archived: meetings.archived,
		})
		.from(meetings)
		.where(eq(meetings.id, meetingData.id))
		.limit(1);

	if (!meeting) {
		return {
			success: false,
			error: "Meeting not found.",
		};
	}

	if (meeting.archived) {
		return {
			success: false,
			error: "This meeting is no longer available.",
		};
	}

	if (meeting.hostId === user.memberId) {
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
				eq(availabilities.meetingId, meetingData.id),
				eq(availabilities.memberId, user.memberId),
			),
		);

	return { success: true };
}

export async function removeMeetingMember(
	meetingId: string,
	targetMemberId: string,
): Promise<LeaveMeetingResult> {
	const { user } = await getCurrentSession();

	if (!user) {
		return { success: false, error: "You must be logged in." };
	}

	const [meeting] = await db
		.select({
			hostId: meetings.hostId,
			archived: meetings.archived,
		})
		.from(meetings)
		.where(eq(meetings.id, meetingId))
		.limit(1);

	if (!meeting) {
		return { success: false, error: "Meeting not found." };
	}

	if (meeting.archived) {
		return {
			success: false,
			error: "This meeting is no longer available.",
		};
	}

	if (meeting.hostId !== user.memberId) {
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
