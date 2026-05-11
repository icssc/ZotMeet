"use server";

import { createGroupSchema } from "@actions/group/create/schema";
import { createNewNotification } from "@data/user/queries";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { db } from "@/db";
import { GroupRole, groupInvites, groups, usersInGroup } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { createBrandedTransactionalEmail } from "@/lib/email/templates";

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

	const { name, description, memberIds, icon } = parsed.data;

	try {
		const { result, inviteToken } = await db.transaction(async (tx) => {
			const [newGroup] = await tx
				.insert(groups)
				.values({
					name,
					description: description || null,
					createdAt: new Date(),
					createdBy: user.id,
					icon: icon || null,
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

		const toNotify = (memberIds ?? []).filter((id) => id !== user.id);
		if (toNotify.length > 0) {
			try {
				const baseUrl =
					process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
				const origin = baseUrl.replace(/\/$/, "");
				const inviteUrl = `${origin}/invite/${inviteToken}`;
				const inviterName = user.displayName?.trim() || "Someone";
				const groupName = name.trim();

				await createNewNotification(
					toNotify,
					groupName,
					`You've been invited to join "${groupName}". Open ZotMeet to respond.`,
					"Group Invite",
					inviteToken,
					result.id,
					user.id,
					{
						email: createBrandedTransactionalEmail({
							subject: `You're invited to join "${groupName}" on ZotMeet`,
							headline: `${inviterName} invited you to a group.`,
							bodyLines: [
								`${inviterName} added you to the new ZotMeet group "${groupName}".`,
								`Accept the invite to collaborate on meetings with the group. You can leave the group whenever you want.`,
							],
							ctaLabel: "Join Group",
							ctaUrl: inviteUrl,
							footerLearnMoreUrl: `${origin}/`,
							footerTopic: "groups",
						}),
					},
				);
			} catch (notificationError) {
				console.error(notificationError);
			}
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
