"use server";

import { inviteGroupMembers } from "@actions/group/invite-members/action";
import { getOrCreateActiveGroupInviteToken } from "@data/groups/invite-queries";
import { getExistingGroup, isGroupAdmin } from "@data/groups/queries";
import { sendGroupInviteEmailsToNonUsers } from "@data/groups/send-group-invite-emails";
import { resolveInviteEmails } from "@data/user/email-invitees";
import { getCurrentSession } from "@/lib/auth";

export type InviteGroupMembersByEmailState = {
	success: boolean;
	message: string;
};

/**
 * Invites UCI directory picks to a group. Anyone who has signed up since being
 * searched gets the normal in-app invite; everyone else is emailed the
 * group's invite link.
 */
export async function inviteGroupMembersByEmail(
	groupId: string,
	emails: string[],
): Promise<InviteGroupMembersByEmailState> {
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

	if (emails.length > 50) {
		return { success: false, message: "Too many invites at once." };
	}

	const { userIds, newEmails } = await resolveInviteEmails(emails);
	if (userIds.length === 0 && newEmails.length === 0) {
		return { success: false, message: "No valid UCI emails selected." };
	}

	if (userIds.length > 0) {
		const result = await inviteGroupMembers(groupId, userIds);
		if (!result.success) return result;
	}

	try {
		const inviteToken = await getOrCreateActiveGroupInviteToken(
			groupId,
			user.id,
		);
		const failed = await sendGroupInviteEmailsToNonUsers({
			emails: newEmails,
			groupName: group.name.trim(),
			inviteToken,
			inviterName: user.displayName?.trim() || "Someone",
		});

		if (failed > 0) {
			return {
				success: false,
				message: `Failed to email ${failed} invite${failed === 1 ? "" : "s"}. Please try again.`,
			};
		}
	} catch (error) {
		console.error("Failed to send group invite emails:", error);
		return {
			success: false,
			message: "Failed to send invites. Please try again.",
		};
	}

	return { success: true, message: "Invites sent successfully!" };
}
