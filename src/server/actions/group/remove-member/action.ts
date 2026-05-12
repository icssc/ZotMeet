"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { usersInGroup } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { isGroupAdmin } from "@/server/data/groups/queries";

export type RemoveGroupMemberState = {
	success: boolean;
	message: string;
};

export async function removeGroupMember(
	groupId: string,
	userId: string,
	isLeaving: boolean,
): Promise<RemoveGroupMemberState> {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			success: false,
			message: "You must be logged in to remove a group member.",
		};
	}

	const admin = await isGroupAdmin({ userId: user.id, groupId });
	if (!admin && !isLeaving) {
		return {
			success: false,
			message: "You do not have permission to remove a group member.",
		};
	}

	await db
		.delete(usersInGroup)
		.where(
			and(eq(usersInGroup.groupId, groupId), eq(usersInGroup.userId, userId)),
		);

	revalidatePath(`/groups/${groupId}`);

	return {
		success: true,
		message: isLeaving
			? "You have left the group."
			: "Group member removed successfully.",
	};
}
