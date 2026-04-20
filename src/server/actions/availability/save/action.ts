"use server";

//import { createGuest } from "@/lib/auth/user";
import { getExistingMeeting, getGroupIdOfMeeting } from "@data/meeting/queries";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import { db } from "@/db";
import { availabilities } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

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
		const existing = await db.query.availabilities.findFirst({
			where: (a, { and, eq }) =>
				and(eq(a.memberId, memberId), eq(a.meetingId, meetingId)),
		});
		const filteredIfNeeded = (existing?.ifNeededAvailabilities ?? []).filter(
			(t) => !availabilityTimes.includes(t),
		);

		if (!meeting) {
			throw new Error("Meeting not found");
		}

		await db
			.insert(availabilities)
			.values({
				memberId,
				meetingId,
				meetingAvailabilities: availabilityTimes,
				ifNeededAvailabilities: filteredIfNeeded,
			})
			.onConflictDoUpdate({
				target: [availabilities.memberId, availabilities.meetingId],
				set: {
					meetingAvailabilities: availabilityTimes,
					ifNeededAvailabilities: filteredIfNeeded,
				},
			});
		const groupId = await getGroupIdOfMeeting(meetingId);
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
		console.error("Error saving availabilities:", error);
		return {
			status: 500,
			body: {
				error: "Failed to save",
			},
		};
	}
}
export async function saveIfNeeded({
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
		const existing = await db.query.availabilities.findFirst({
			where: (a, { and, eq }) =>
				and(eq(a.memberId, memberId), eq(a.meetingId, meetingId)),
		});

		const filteredAvailability = (existing?.meetingAvailabilities ?? []).filter(
			(t) => !availabilityTimes.includes(t),
		);
		if (!meeting) {
			throw new Error("Meeting not found");
		}

		await db
			.insert(availabilities)
			.values({
				memberId,
				meetingId,
				meetingAvailabilities: filteredAvailability,
				ifNeededAvailabilities: availabilityTimes,
			})
			.onConflictDoUpdate({
				target: [availabilities.memberId, availabilities.meetingId],
				set: {
					meetingAvailabilities: filteredAvailability,
					ifNeededAvailabilities: availabilityTimes,
				},
			});

		return {
			status: 200,
			body: {
				message: "Saved successfully",
			},
		};
	} catch (error) {
		console.error("Error saving ifNeeded:", error);
		return {
			status: 500,
			body: {
				error: "Failed to save",
			},
		};
	}
}
