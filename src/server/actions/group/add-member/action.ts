"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { groupInvites, usersInGroup } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { NOTIFICATION_TYPES } from "@/lib/notification/types";
import { getExistingGroup, isGroupAdmin } from "@/server/data/groups/queries";
import { createNewNotification } from "@/server/data/user/queries";

export type AddGroupMemberState = {
	success: boolean;
	message: string;
};

export async function inviteGroupMember(
	groupId: string,
	userId: string,
): Promise<AddGroupMemberState> {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			success: false,
			message: "You must be logged in to invite members.",
		};
	}

	const admin = await isGroupAdmin({
		userId: user.id,
		groupId,
	});

	if (!admin) {
		return {
			success: false,
			message: "You do not have permission to invite members.",
		};
	}

	const group = await getExistingGroup(groupId);
	if (!group) {
		return {
			success: false,
			message: "Group not found.",
		};
	}

	try {
		const inviteToken = await db.transaction(async (tx) => {
			// Make sure target user isn't already in group
			const existingMembership = await tx
				.select()
				.from(usersInGroup)
				.where(
					and(
						eq(usersInGroup.groupId, groupId),
						eq(usersInGroup.userId, userId),
					),
				);

			if (existingMembership.length > 0) {
				throw new Error("User is already in this group.");
			}

			// Create invite token
			const token = crypto.randomUUID();

			await tx.insert(groupInvites).values({
				groupId,
				inviteToken: token,
				inviterId: user.id,
				inviteeEmail: "",
				sentAt: new Date(),
			});

			return token;
		});

		// Send invite notification
		try {
			await createNewNotification(
				[userId],
				group.name,
				`You've been invited to join ${group.name}!`,
				NOTIFICATION_TYPES.GROUP_INVITE,
				inviteToken,
				groupId,
				user.id,
			);
		} catch (notificationError) {
			console.error(notificationError);
			return {
				success: false,
				message: "Failed to send invite notification. Please try again.",
			};
		}

		revalidatePath(`/groups/${groupId}`);

		return {
			success: true,
			message: "Member invited successfully.",
		};
	} catch (error) {
		console.error("Failed to invite member:", error);

		if (
			error instanceof Error &&
			error.message === "User is already in this group."
		) {
			return {
				success: false,
				message: error.message,
			};
		}

		return {
			success: false,
			message: "Failed to invite member. Please try again.",
		};
	}
}
