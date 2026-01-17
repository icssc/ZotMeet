"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { groupInvites, type SelectGroup } from "@/db/schema";
//session
//db functions
import { getCurrentSession } from "@/lib/auth";
//good prac to read through queries to see what func we can use
import { getExistingGroup, isGroupCreator } from "@/server/data/groups/queries";

//type def
export type CreateInviteState = {
	success: boolean;
	message: string; // ← Added comma
	inviteToken?: string;
	inviteUrl?: string;
};

export async function createGroupInvite(
	groupId: string,
	inviteeEmail: string,
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

	// Validate email
	if (!inviteeEmail || !inviteeEmail.includes("@")) {
		return {
			success: false,
			message: "Invalid email address.",
		};
	}

	//check if group exists
	let group: SelectGroup;
	try {
		group = await getExistingGroup(groupId);
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
		const [newInvite] = await db
			.insert(groupInvites)
			.values({
				groupId,
				inviteToken,
				inviteeEmail: inviteeEmail.toLowerCase().trim(), // Normalize email
				inviterId: user.id,
				expiresAt,
				sentAt: new Date(),
			})
			.returning({ inviteToken: groupInvites.inviteToken }); //  CRITICAL

		// Revalidate cache - so UI updates
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
