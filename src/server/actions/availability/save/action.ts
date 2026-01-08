"use server";

import { db } from "@/db";
import { availabilities } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
//import { createGuest } from "@/lib/auth/user";
import { getExistingMeeting } from "@data/meeting/queries";

interface saveAvailabilityProps {
	meetingId: string;
	availabilityTimes: string[];
	displayName?: string;
}

export async function saveAvailability({
	meetingId,
	availabilityTimes,
	displayName: _displayName,
}: saveAvailabilityProps) {
	try {
		const { user } = await getCurrentSession();

		if (!user) {
			throw new Error("User not found");
		}

		const memberId = user.memberId;

		//Guest functionality disabled for now
		//TODO: Guest
		// if (!user) {
		//     const guest = await createGuest({
		//         displayName:
		//             displayName ??
		//             `TEST_${Math.floor(Math.random() * 1000 + 1)}`,
		//         meetingId,
		//     });
		//     memberId = guest.memberId;
		// } else {
		//     memberId = user.memberId;
		// }

		const meeting = await getExistingMeeting(meetingId);

		if (!meeting) {
			throw new Error("Meeting not found");
		}

		await db
			.insert(availabilities)
			.values({
				memberId,
				meetingId,
				meetingAvailabilities: availabilityTimes,
			})
			.onConflictDoUpdate({
				target: [availabilities.memberId, availabilities.meetingId],
				set: {
					meetingAvailabilities: availabilityTimes,
				},
			});

		return {
			status: 200,
			body: {
				message: "Saved successfully",
			},
		};
	} catch (error) {
		console.error("Error saving availabilities:", error);
		return {
			status: 500,
			body: {
				error: "Failed to save",
			},
		};
	}
}
