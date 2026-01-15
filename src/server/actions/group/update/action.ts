"use server";

import { updateGroupSchema } from "@actions/group/update/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { db } from "@/db";
import { groups } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

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

	try {
		const [existingGroup] = await db
			.select({
				id: groups.id,
				createdBy: groups.createdBy,
			})
			.from(groups)
			.where(eq(groups.id, groupId));

		if (!existingGroup) {
			return {
				success: false,
				message: "Group not found.",
			};
		}

		if (existingGroup.createdBy !== user.id) {
			return {
				success: false,
				message: "You do not have permission to update this group.",
			};
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
