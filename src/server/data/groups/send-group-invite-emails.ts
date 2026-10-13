import "server-only";

import { createBrandedTransactionalEmail } from "@/lib/email/templates";
import { sendInviteEmails } from "@/server/data/user/email-invitees";

/**
 * Emails a group invite link to people who don't have a ZotMeet account yet.
 * `/invite/<token>` sends them through sign-in, then to the accept screen.
 * Returns how many sends failed.
 */
export async function sendGroupInviteEmailsToNonUsers(params: {
	emails: string[];
	groupName: string;
	inviteToken: string;
	inviterName: string;
}): Promise<number> {
	const { emails, groupName, inviteToken, inviterName } = params;
	if (emails.length === 0) return 0;

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
	const origin = baseUrl.replace(/\/$/, "");

	return sendInviteEmails(
		emails,
		createBrandedTransactionalEmail({
			subject: `${inviterName} invited you to join "${groupName}" on ZotMeet`,
			headline: `${inviterName} invited you to a group.`,
			bodyLines: [
				`${inviterName} has invited you to join the ZotMeet group "${groupName}".`,
				"Sign in with your UCI Google account to accept. You can leave the group whenever you want.",
			],
			ctaLabel: "Join Group",
			ctaUrl: `${origin}/invite/${inviteToken}`,
			footerLearnMoreUrl: `${origin}/`,
			footerTopic: "groups",
		}),
	);
}
