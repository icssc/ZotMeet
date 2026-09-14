"use server";

import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/auth";
import { savePersonalAvailabilityForMember } from "@/server/data/availability/save";

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

		const { groupId } = await savePersonalAvailabilityForMember({
			meetingId,
			memberId: user.memberId,
			meetingAvailabilityTimes,
			ifNeededAvailabilityTimes,
		});

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
