"use server";

import type { SelectMeeting } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import {
	archiveMeetingForMember,
	type MeetingMemberActionResult,
} from "@/server/data/meeting/member-actions";

export type ArchiveMeetingResult = MeetingMemberActionResult;

export async function archiveMeeting(
	meetingData: SelectMeeting,
): Promise<ArchiveMeetingResult> {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			success: false,
			error: "You must be logged in to delete a meeting.",
		};
	}

	return archiveMeetingForMember(meetingData.id, user.memberId);
}
