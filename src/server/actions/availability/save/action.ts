"use server";

import { getExistingMeeting } from "@data/meeting/queries";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { availabilities } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

export async function savePersonalAvailability({
	meetingId,
	meetingAvailabilityTimes,
	ifNeededAvailabilityTimes,
}: {
	meetingId: string;
	meetingAvailabilityTimes: string[];
	ifNeededAvailabilityTimes: string[];
}) {
	try {
		const { user } = await getCurrentSession();

		if (!user) {
			throw new Error("User not found");
		}

		const memberId = user.memberId;

		const meeting = await getExistingMeeting(meetingId);
		if (!meeting) {
			throw new Error("Meeting not found");
		}

		const ifNeededSet = new Set(ifNeededAvailabilityTimes);
		const meetingAvailabilities = meetingAvailabilityTimes.filter(
			(t) => !ifNeededSet.has(t),
		);

		await db
			.insert(availabilities)
			.values({
				memberId,
				meetingId,
				meetingAvailabilities,
				ifNeededAvailabilities: ifNeededAvailabilityTimes,
			})
			.onConflictDoUpdate({
				target: [availabilities.memberId, availabilities.meetingId],
				set: {
					meetingAvailabilities,
					ifNeededAvailabilities: ifNeededAvailabilityTimes,
				},
			});

		const groupId = meeting.group_id;
		if (groupId) {
			revalidatePath(`/groups/${groupId}`);
		}

		return {
			status: 200,
			body: {
				message: "Saved successfully",
			},
		};
	} catch (error) {
		console.error("Error saving personal availability:", error);
		return {
			status: 500,
			body: {
				error: "Failed to save",
			},
		};
	}
}
