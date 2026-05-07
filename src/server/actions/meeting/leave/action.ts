"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { availabilities, type SelectMeeting } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

export async function leaveMeeting(meetingData: SelectMeeting) {
	const { user } = await getCurrentSession();

	if (!user) {
		return { error: "You must be logged in to leave a meeting." };
	}

	if (meetingData.hostId === user.memberId) {
		return {
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
