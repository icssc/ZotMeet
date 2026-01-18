"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
	groupInvites,
	type SelectGroup,
	type SelectGroupInvite,
	usersInGroup,
} from "@/db/schema";
//session
//db functions
import { getCurrentSession } from "@/lib/auth";
import { getExistingInvite } from "@/server/data/groups/invite-queries";
//good prac to read through queries to see what func we can use
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
	inviteeEmails: string | string[],
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

	const emails = Array.isArray(inviteeEmails) ? inviteeEmails : [inviteeEmails];

	// Validate emails
	if (emails.length === 0) {
		return {
			success: false,
			message: "At least one email address is required.",
		};
	}

	// Validate each email
	for (const email of emails) {
		if (!email || !email.includes("@")) {
			return {
				success: false,
				message: `Invalid email address: ${email}`,
			};
		}
	}

	//check if group exists
	let _group: SelectGroup;
	try {
		_group = await getExistingGroup(groupId);
	} catch (_error) {
		return {
			success: false,
			message: "group not found",
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
		// Normalize all emails (lowercase, trim)
		const normalizedEmails = emails.map((email) => email.toLowerCase().trim());

		const [newInvite] = await db
			.insert(groupInvites)
			.values({
				groupId,
				inviteToken,
				inviteeEmails: normalizedEmails, // Array of emails
				inviterId: user.id,
				expiresAt,
				sentAt: new Date(),
			})
			.returning({ inviteToken: groupInvites.inviteToken }); //  CRITICAL

		revalidatePath("/groups");
		revalidatePath(`/groups/${groupId}`); //

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
		return {
			success: false,
			message: "Failed to create invite. Please try again.",
		};
	}
}

//typedef
export type AcceptInviteState = {
	success: boolean;
	message: string;
	groupId?: string;
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
	} catch (_error) {
		return {
			success: false,
			message: "Invite not found!",
		};
	}

	if (invite.status !== "pending") {
		return {
			success: false,
			message: "Invite already responded",
		};
	}

	// Check if invite has expired
	if (invite.expiresAt && invite.expiresAt < new Date()) {
		return {
			success: false,
			message: "This invite has expired.",
		};
	}

	/*
	for specific email invites
	// Verify email matches (check if user's email is in the inviteeEmails array)
	if (!invite.inviteeEmails.includes(user.email.toLowerCase())) {
		return {
			success: false,
			message: "This invite was sent to a different email address.",
		};
	}
	*/

	// Check if user is already in the group
	const alreadyInGroup = await isUserInGroup({
		userId: user.id,
		groupId: invite.groupId,
	});

	if (alreadyInGroup) {
		// Still update the invite status even if already in group
		const userEmail = user.email.toLowerCase().trim();
		const updatedEmails = invite.inviteeEmails.includes(userEmail)
			? invite.inviteeEmails
			: [...invite.inviteeEmails, userEmail];

		await db
			.update(groupInvites)
			.set({
				status: "accepted",
				respondedAt: new Date(),
				userId: user.id,
				inviteeEmails: updatedEmails,
			})
			.where(eq(groupInvites.inviteToken, groupInviteToken));

		revalidatePath("/groups");
		revalidatePath(`/groups/${invite.groupId}`);

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
			const updatedEmails = invite.inviteeEmails.includes(userEmail)
				? invite.inviteeEmails
				: [...invite.inviteeEmails, userEmail];

			//update invite status
			await tx
				.update(groupInvites)
				.set({
					status: "accepted",
					respondedAt: new Date(),
					userId: user.id,
					inviteeEmails: updatedEmails,
				})
				.where(eq(groupInvites.inviteToken, groupInviteToken));

			//add user to group
			await tx.insert(usersInGroup).values({
				userId: user.id,
				groupId: invite.groupId,
			});
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
