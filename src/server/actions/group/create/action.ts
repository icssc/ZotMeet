"use server";

import { createGroupSchema } from "@actions/group/create/schema";
import { createNewNotification } from "@data/user/queries";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { db } from "@/db";
import { GroupRole, groupInvites, groups, usersInGroup } from "@/db/schema";
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

	const parsed = createGroupSchema.safeParse(payload);

	if (!parsed.success) {
		return {
			success: false,
			message: parsed.error.errors[0]?.message || "Invalid input",
		};
	}

	const { name, description, memberIds } = parsed.data;

	try {
		const { result, inviteToken } = await db.transaction(async (tx) => {
			const [newGroup] = await tx
				.insert(groups)
				.values({
					name,
					description: description || null,
					createdAt: new Date(),
					createdBy: user.id,
				})
				.returning({ id: groups.id });

			if (!newGroup) {
				throw new Error("Failed to create group");
			}

			await tx.insert(usersInGroup).values({
				userId: user.id,
				groupId: newGroup.id,
				role: GroupRole.ADMIN,
			});

			// Generate token here so we own it as a local variable
			const token = crypto.randomUUID();
			await tx.insert(groupInvites).values({
				groupId: newGroup.id,
				inviteToken: token,
				inviterId: user.id,
				inviteeEmail: "",
				sentAt: new Date(),
			});

			return { result: newGroup, inviteToken: token };
		});

		try {
			await createNewNotification(
				(memberIds ?? []).filter((id) => id !== user.memberId),
				name.trim(),
				`You've been invited to join ${name.trim()}!`,
				"Group Invite",
				inviteToken,
				user.displayName,
			);
		} catch (notificationError) {
			console.error(notificationError);
		}

		revalidatePath("/summary");
		revalidatePath("/groups");

		return {
			success: true,
			message: "Group created successfully",
			groupId: result.id,
		};
	} catch (error) {
		console.error("Failed to create group:", error);
		return {
			success: false,
			message: "Failed to create group. Please try again.",
		};
	}
}
