"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { groups } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

export type DeleteGroupState = {
	success: boolean;
	message: string;
};

export async function deleteGroup(groupId: string): Promise<DeleteGroupState> {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			success: false,
			message: "You must be logged in to delete a group.",
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
				message: "You do not have permission to delete this group.",
			};
		}

		await db.delete(groups).where(eq(groups.id, groupId));

		revalidatePath("/summary");
		revalidatePath("/groups");

		return {
			success: true,
			message: "Group deleted successfully",
		};
	} catch (error) {
		console.error("Failed to delete group:", error);
		return {
			success: false,
			message: "Failed to delete group. Please try again.",
		};
	}
}
