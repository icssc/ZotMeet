"use server";

import {
	type SaveAvailabilityInput,
	saveAvailabilitySchema,
} from "@zotmeet/shared";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/auth";
import { savePersonalAvailabilityForMember } from "@/server/data/availability/save";

export async function savePersonalAvailability({
	meetingId,
	...input
}: { meetingId: string } & SaveAvailabilityInput) {
	try {
		const { user } = await getCurrentSession();

		if (!user) {
			throw new Error("User not found");
		}

		const parsed = saveAvailabilitySchema.safeParse(input);
		if (!parsed.success) {
			throw new Error("Invalid payload");
		}

		const { groupId } = await savePersonalAvailabilityForMember({
			meetingId,
			memberId: user.memberId,
			...parsed.data,
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
