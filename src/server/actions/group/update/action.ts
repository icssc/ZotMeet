"use server";

import { updateGroupSchema } from "@actions/group/update/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { db } from "@/db";
import type { SelectGroup } from "@/db/schema";
import { groups } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import {
	getExistingGroup,
	getGroupNameExists,
	isGroupCreator,
} from "@/server/data/groups/queries";

export type UpdateGroupState = {
	success: boolean;
	message: string;
};

export async function updateGroup(
	payload: z.infer<typeof updateGroupSchema>,
): Promise<UpdateGroupState> {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			success: false,
			message: "You must be logged in to update a group.",
		};
	}

	const parsed = updateGroupSchema.safeParse(payload);

	if (!parsed.success) {
		return {
			success: false,
			message: parsed.error.errors[0]?.message || "Invalid input",
		};
	}

	const { groupId, name, description } = parsed.data;

	if (!name && description === undefined) {
		return {
			success: false,
			message: "At least one field must be provided to update.",
		};
	}

	let existingGroup: SelectGroup;
	try {
		existingGroup = await getExistingGroup(groupId);
	} catch {
		return {
			success: false,
			message: "Group not found.",
		};
	}

	try {
		const isCreator = await isGroupCreator({ userId: user.id, groupId });

		if (!isCreator) {
			return {
				success: false,
				message: "You do not have permission to update this group.",
			};
		}

		if (name && name !== existingGroup.name) {
			const nameExists = await getGroupNameExists(name);
			if (nameExists) {
				return {
					success: false,
					message: "A group with this name already exists.",
				};
			}
		}

		const updateData: { name?: string; description?: string | null } = {};
		if (name) updateData.name = name;
		if (description !== undefined) updateData.description = description || null;

		await db.update(groups).set(updateData).where(eq(groups.id, groupId));

		revalidatePath("/summary");
		revalidatePath("/groups");

		return {
			success: true,
			message: "Group updated successfully",
		};
	} catch (error) {
		console.error("Failed to update group:", error);
		return {
			success: false,
			message: "Failed to update group. Please try again.",
		};
	}
}
