"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
	groupInviteResponses,
	groupInvites,
	type SelectGroup,
	type SelectGroupInvite,
	type SelectGroupInviteResponse,
	usersInGroup,
} from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { getExistingInvite } from "@/server/data/groups/invite-queries";
import {
	getExistingGroup,
	isGroupCreator,
	isUserInGroup,
} from "@/server/data/groups/queries";
//type def
export type CreateInviteState = {
	success: boolean;
	message: string;
	inviteToken?: string;
	inviteUrl?: string;
};

export async function createGroupInvite(
	groupId: string,
	// future: for private invites
	// inviteeEmails: string | string[],
	expiresInDays?: number,
): Promise<CreateInviteState> {
	//check auth
	const { user } = await getCurrentSession();
	if (!user) {
		return {
			success: false,
			message: "not logged in",
		};
	}

	//check if group exists
	let group: SelectGroup;
	try {
		group = await getExistingGroup(groupId);
	} catch (_error) {
		return {
			success: false,
			message: "Group not found",
		};
	}

	// check if is group creator
	const groupCreator = await isGroupCreator({
		userId: user.id,
		groupId: groupId,
	});
	if (!groupCreator) {
		return {
			success: false,
			message: "You do not have permission to invite",
		};
	}

	// GENERATE UNIQUE TOKEN FOR Invite
	const inviteToken = crypto.randomUUID();

	// Calculate expiration date
	const expiresAt = expiresInDays
		? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
		: null;

	// Insert Invite to DB
	try {
		const [newInvite] = await db
			.insert(groupInvites)
			.values({
				groupId,
				inviteToken,
				//inviteeEmails,
				inviterId: user.id,
				expiresAt,
				sentAt: new Date(),
			})
			.returning({ inviteToken: groupInvites.inviteToken }); //  CRITICAL

		revalidatePath("/groups");
		revalidatePath(`/groups/${groupId}`);

		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
		const inviteUrl = `${baseUrl}/invite/${newInvite.inviteToken}`;

		console.log("successfully created invite");
		return {
			success: true,
			message: "Invite created successfully",
			inviteToken: newInvite.inviteToken,
			inviteUrl,
		};
	} catch (error) {
		console.error("Failed to create invite:", error);
		const isProduction =
			process.env.NODE_ENV === "production" &&
			!process.env.NEXT_PUBLIC_BASE_URL?.includes("staging");
		const errorDetail =
			!isProduction && error instanceof Error ? ` (${error.message})` : "";
		return {
			success: false,
			message: `Failed to create invite. Please try again.${errorDetail}`,
		};
	}
}

export type AcceptInviteState = {
	success: boolean;
	message: string;
	groupId?: string;
};

export type DeclineInviteState = {
	success: boolean;
	message: string;
};

export async function acceptInvite(
	groupInviteToken: string,
): Promise<AcceptInviteState> {
	//verify auth
	const { user } = await getCurrentSession();
	if (!user) {
		return {
			success: false,
			message: "user not logged in",
		};
	}

	//verify valid invite
	let invite: SelectGroupInvite;
	try {
		invite = await getExistingInvite(groupInviteToken);
	} catch (error) {
		return {
			success: false,
			message: "Invite not found!",
		};
	}

	// Check if invite has expired
	if (invite.expiresAt && invite.expiresAt < new Date()) {
		return {
			success: false,
			message: "This invite has expired.",
		};
	}

	// Check if user has already responded to this invite
	const [existingResponse] = await db
		.select()
		.from(groupInviteResponses)
		.where(
			and(
				eq(groupInviteResponses.inviteId, invite.id),
				eq(groupInviteResponses.userId, user.id),
			),
		)
		.limit(1);

	// Check if user is already in the group
	const alreadyInGroup = await isUserInGroup({
		userId: user.id,
		groupId: invite.groupId,
	});

	// If already accepted and in group, return success
	if (existingResponse?.status === "accepted" && alreadyInGroup) {
		return {
			success: true,
			message: "You are already a member of this group.",
			groupId: invite.groupId,
		};
	}

	//add user to group
	try {
		await db.transaction(async (tx) => {
			const userEmail = user.email.toLowerCase().trim();

			// Update existing response or create new one
			if (existingResponse) {
				// Update existing response to accepted
				await tx
					.update(groupInviteResponses)
					.set({
						status: "accepted",
						respondedAt: new Date(),
					})
					.where(eq(groupInviteResponses.id, existingResponse.id));
			} else {
				// Insert new response record
				await tx.insert(groupInviteResponses).values({
					inviteId: invite.id,
					userId: user.id,
					email: userEmail,
					status: "accepted",
					respondedAt: new Date(),
				});
			}

			// Add user to group (only if not already in group)
			if (!alreadyInGroup) {
				await tx.insert(usersInGroup).values({
					userId: user.id,
					groupId: invite.groupId,
				});
			}
		});

		revalidatePath("/groups");
		revalidatePath(`/groups/${invite.groupId}`);
		revalidatePath("/summary");

		return {
			success: true,
			message: "Successfully joined group!",
			groupId: invite.groupId,
		};
	} catch (error) {
		console.error("Failed to accept invite:", error);
		return {
			success: false,
			message: "Error joining group :(",
		};
	}
}

export async function declineInvite(
	groupInviteToken: string,
): Promise<DeclineInviteState> {
	//verify auth
	const { user } = await getCurrentSession();
	if (!user) {
		return {
			success: false,
			message: "user not logged in",
		};
	}

	//verify valid invite
	let invite: SelectGroupInvite;
	try {
		invite = await getExistingInvite(groupInviteToken);
	} catch (error) {
		return {
			success: false,
			message: "Invite not found!",
		};
	}

	// Check if invite has expired
	if (invite.expiresAt && invite.expiresAt < new Date()) {
		return {
			success: false,
			message: "This invite has expired.",
		};
	}

	// Check if user has already responded to this invite
	const [existingResponse] = await db
		.select()
		.from(groupInviteResponses)
		.where(
			and(
				eq(groupInviteResponses.inviteId, invite.id),
				eq(groupInviteResponses.userId, user.id),
			),
		)
		.limit(1);

	// Check if user is in the group (need to remove them if switching from accepted)
	const alreadyInGroup = await isUserInGroup({
		userId: user.id,
		groupId: invite.groupId,
	});

	// Create or update decline response record
	try {
		await db.transaction(async (tx) => {
			const userEmail = user.email.toLowerCase().trim();

			// Update existing response or create new one
			if (existingResponse) {
				// Update existing response to declined
				await tx
					.update(groupInviteResponses)
					.set({
						status: "declined",
						respondedAt: new Date(),
					})
					.where(eq(groupInviteResponses.id, existingResponse.id));
			} else {
				// Insert new response record
				await tx.insert(groupInviteResponses).values({
					inviteId: invite.id,
					userId: user.id,
					email: userEmail,
					status: "declined",
					respondedAt: new Date(),
				});
			}

			// If user was in group (from previous accept), remove them
			if (alreadyInGroup) {
				await tx
					.delete(usersInGroup)
					.where(
						and(
							eq(usersInGroup.userId, user.id),
							eq(usersInGroup.groupId, invite.groupId),
						),
					);
			}
		});

		revalidatePath("/groups");
		revalidatePath(`/groups/${invite.groupId}`);
		revalidatePath("/summary");

		return {
			success: true,
			message: "Invite declined successfully.",
		};
	} catch (error) {
		console.error("Failed to decline invite:", error);
		return {
			success: false,
			message: "Error declining invite :(",
		};
	}
}
