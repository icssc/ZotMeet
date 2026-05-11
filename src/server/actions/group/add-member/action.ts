"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { usersInGroup } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { isGroupAdmin } from "@/server/data/groups/queries";

export type AddGroupMemberState = {
	success: boolean;
	message: string;
};

export async function addGroupMember(
	groupId: string,
	userId: string,
): Promise<AddGroupMemberState> {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			success: false,
			message: "You must be logged in to add a group member.",
		};
	}

	const admin = await isGroupAdmin({ userId: user.id, groupId });
	if (!admin) {
		return {
			success: false,
			message: "You do not have permission to add a group member.",
		};
	}

	await db
		.insert(usersInGroup)
		.values({
			groupId,
			userId,
		})
		.onConflictDoNothing();

	revalidatePath(`/groups/${groupId}`);

	return {
		success: true,
		message: "Group member added successfully.",
	};
}
