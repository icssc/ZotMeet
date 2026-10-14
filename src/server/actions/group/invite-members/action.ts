"use server";

import { inviteEmailsSchema } from "@zotmeet/shared";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/auth";
import { sendEmailToEach } from "@/lib/email/send-email";
import { createBrandedTransactionalEmail } from "@/lib/email/templates";
import { NOTIFICATION_TYPES } from "@/lib/notification/types";
import { getOrCreateActiveGroupInviteToken } from "@/server/data/groups/invite-queries";
import {
	getExistingGroup,
	getUsersInGroup,
	isGroupAdmin,
} from "@/server/data/groups/queries";
import {
	createNewNotification,
	partitionInviteEmails,
} from "@/server/data/user/queries";

export type InviteGroupMembersState = {
	success: boolean;
	message: string;
};

export async function inviteGroupMembers(
	groupId: string,
	memberUserIds: string[],
	emails: string[] = [],
): Promise<InviteGroupMembersState> {
	const { user } = await getCurrentSession();
	if (!user) {
		return { success: false, message: "Not logged in." };
	}

	const isAdmin = await isGroupAdmin({ userId: user.id, groupId });
	if (!isAdmin) {
		return {
			success: false,
			message: "You do not have permission to invite members to this group.",
		};
	}

	let group: Awaited<ReturnType<typeof getExistingGroup>>;
	try {
		group = await getExistingGroup(groupId);
	} catch {
		return { success: false, message: "Group not found." };
	}

	const parsedEmails = inviteEmailsSchema.safeParse(emails);
	if (!parsedEmails.success) {
		return {
			success: false,
			message: parsedEmails.error.issues[0]?.message ?? "Invalid email.",
		};
	}

	if (memberUserIds.length === 0 && parsedEmails.data.length === 0) {
		return { success: false, message: "No members selected." };
	}

	const { userIds: emailUserIds, unregisteredEmails } =
		await partitionInviteEmails(parsedEmails.data, user.id);

	const currentMembers = await getUsersInGroup(groupId);
	const memberIdSet = new Set(currentMembers.map((m) => m.userId));

	const targetIds = [...new Set([...memberUserIds, ...emailUserIds])].filter(
		(id) => id !== user.id && !memberIdSet.has(id),
	);

	if (targetIds.length === 0 && unregisteredEmails.length === 0) {
		return {
			success: false,
			message:
				"No new members to invite. Selected users are already in the group or invalid.",
		};
	}

	try {
		const inviteToken = await getOrCreateActiveGroupInviteToken(
			groupId,
			user.id,
		);

		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
		const origin = baseUrl.replace(/\/$/, "");
		const inviteUrl = `${origin}/invite/${inviteToken}`;
		const inviterName = user.displayName?.trim() || "Someone";
		const groupName = group.name.trim();

		const email = createBrandedTransactionalEmail({
			subject: `You're invited to join "${groupName}" on ZotMeet`,
			headline: `${inviterName} invited you to a group.`,
			bodyLines: [
				`${inviterName} has invited you to join the ZotMeet group "${groupName}".`,
				`Accept the invite to collaborate on meetings with the group. You can leave the group whenever you want.`,
			],
			ctaLabel: "Join Group",
			ctaUrl: inviteUrl,
			footerLearnMoreUrl: `${origin}/`,
			footerTopic: "groups",
		});

		await createNewNotification(
			targetIds,
			groupName,
			`You've been invited to join "${groupName}". Open ZotMeet to respond.`,
			NOTIFICATION_TYPES.GROUP_INVITE,
			inviteToken,
			groupId,
			user.id,
			{ email },
		);

		await sendEmailToEach(unregisteredEmails, email);

		revalidatePath(`/groups/${groupId}`);
		revalidatePath("/summary");

		return { success: true, message: "Invites sent successfully!" };
	} catch (error) {
		console.error("Failed to send group invites:", error);
		return {
			success: false,
			message: "Failed to send invites. Please try again.",
		};
	}
}
