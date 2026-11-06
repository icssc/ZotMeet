import "server-only";

import { createNewNotification } from "@data/user/queries";
import {
	type CreateGroupInput,
	type CreateGroupResponse,
	createGroupSchema,
} from "@zotmeet/shared";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
	GroupRole,
	groupInvites,
	groups,
	members,
	users,
	usersInGroup,
} from "@/db/schema";
import { createBrandedTransactionalEmail } from "@/lib/email/templates";
import { NOTIFICATION_TYPES } from "@/lib/notification/types";

/**
 * Group mutations shared by the session-cookie server actions
 * (`@actions/group/*`) and the bearer-token API routes (`/api/groups/*`).
 * Not a `"use server"` module: these take `memberId` on trust.
 */

export async function resolveGroupActor(
	memberId: string,
): Promise<{ userId: string; displayName: string } | null> {
	const [actor] = await db
		.select({ userId: users.id, displayName: members.displayName })
		.from(users)
		.innerJoin(members, eq(users.memberId, members.id))
		.where(eq(users.memberId, memberId))
		.limit(1);

	return actor ?? null;
}

export async function createGroupForMember(
	payload: CreateGroupInput,
	memberId: string,
): Promise<CreateGroupResponse> {
	const actor = await resolveGroupActor(memberId);
	if (!actor) {
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
					createdBy: actor.userId,
					icon: icon || null,
				})
				.returning({ id: groups.id });

			if (!newGroup) {
				throw new Error("Failed to create group");
			}

			await tx.insert(usersInGroup).values({
				userId: actor.userId,
				groupId: newGroup.id,
				role: GroupRole.ADMIN,
			});

			// Generate token here so we own it as a local variable
			const token = crypto.randomUUID();
			await tx.insert(groupInvites).values({
				groupId: newGroup.id,
				inviteToken: token,
				inviterId: actor.userId,
				inviteeEmail: "",
				sentAt: new Date(),
			});

			return { result: newGroup, inviteToken: token };
		});

		const toNotify = (memberIds ?? []).filter((id) => id !== actor.userId);
		if (toNotify.length > 0) {
			try {
				const baseUrl =
					process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
				const origin = baseUrl.replace(/\/$/, "");
				const inviteUrl = `${origin}/invite/${inviteToken}`;
				const inviterName = actor.displayName?.trim() || "Someone";
				const groupName = name.trim();

				let notificationEmail:
					| ReturnType<typeof createBrandedTransactionalEmail>
					| undefined;
				try {
					notificationEmail = createBrandedTransactionalEmail({
						subject: `Action Required: Join "${groupName}" on ZotMeet`,
						headline: `${inviterName} invited you to a group.`,
						bodyLines: [
							`${inviterName} invited you to join "${groupName}".`,
							`Be up-to-date with all meetings associated with the group "${groupName}." You can leave the group whenever you want.`,
						],
						ctaLabel: "Join Group",
						ctaUrl: inviteUrl,
						footerLearnMoreUrl: `${origin}/`,
						footerTopic: "groups",
					});
				} catch (emailTemplateError) {
					console.error(
						"Failed to build group invite email template:",
						emailTemplateError,
					);
				}

				await createNewNotification(
					toNotify,
					groupName,
					`You've been invited to join "${groupName}". Open ZotMeet to respond.`,
					NOTIFICATION_TYPES.GROUP_INVITE,
					inviteToken,
					result.id,
					actor.userId,
					notificationEmail ? { email: notificationEmail } : undefined,
				);
			} catch (notificationError) {
				console.error(notificationError);
			}
		}

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
