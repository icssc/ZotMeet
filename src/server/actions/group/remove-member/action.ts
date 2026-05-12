"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { GroupRole, usersInGroup } from "@/db/schema";
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

	// When leaving, you can only remove yourself
	if (isLeaving && userId !== user.id) {
		return {
			success: false,
			message: "You can only leave the group yourself.",
		};
	}

	// Check if the target user is an admin
	const targetMembership = await db
		.select()
		.from(usersInGroup)
		.where(
			and(eq(usersInGroup.groupId, groupId), eq(usersInGroup.userId, userId)),
		);

	// verify that the target user is not the last admin before removing
	if (
		targetMembership.length > 0 &&
		targetMembership[0].role === GroupRole.ADMIN
	) {
		const [{ count }] = await db
			.select({ count: sql<number>`count(*)` })
			.from(usersInGroup)
			.where(
				and(
					eq(usersInGroup.groupId, groupId),
					eq(usersInGroup.role, GroupRole.ADMIN),
				),
			);

		if (count <= 1) {
			return {
				success: false,
				message: "Cannot remove the last admin. Assign another admin first.",
			};
		}
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
			? "You have successfully left the group."
			: "Group member removed successfully.",
	};
}
