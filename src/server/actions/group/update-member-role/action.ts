"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { type GroupRole, usersInGroup } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { isGroupAdmin } from "@/server/data/groups/queries";

export type UpdateMemberRoleState = {
	success: boolean;
	message: string;
};

export async function updateMemberRole({
	groupId,
	targetUserId,
	role,
}: {
	groupId: string;
	targetUserId: string;
	role: GroupRole;
}): Promise<UpdateMemberRoleState> {
	const { user } = await getCurrentSession();

	if (!user) {
		return { success: false, message: "You must be logged in." };
	}

	if (user.id === targetUserId) {
		return { success: false, message: "You cannot change your own role." };
	}

	const admin = await isGroupAdmin({ userId: user.id, groupId });
	if (!admin) {
		return {
			success: false,
			message: "You do not have permission to change member roles.",
		};
	}

	await db
		.update(usersInGroup)
		.set({ role })
		.where(
			and(
				eq(usersInGroup.groupId, groupId),
				eq(usersInGroup.userId, targetUserId),
			),
		);

	revalidatePath(`/groups/${groupId}`);

	return { success: true, message: "Role updated." };
}
