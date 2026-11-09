"use server";

import type { createGroupSchema } from "@actions/group/create/schema";
import { createGroupForMember } from "@data/groups/member-actions";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { getCurrentSession } from "@/lib/auth";

export type CreateGroupState = {
	success: boolean;
	message: string;
	groupId?: string;
};

export async function createGroup(
	payload: z.infer<typeof createGroupSchema>,
): Promise<CreateGroupState> {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			success: false,
			message: "You must be logged in to create a group.",
		};
	}

	const result = await createGroupForMember(payload, user.memberId);

	if (result.success) {
		revalidatePath("/summary");
		revalidatePath("/groups");
	}

	return result;
}
