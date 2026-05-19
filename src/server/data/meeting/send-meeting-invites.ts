import "server-only";

import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { availabilities, meetingInvites, users } from "@/db/schema";
import { createBrandedTransactionalEmail } from "@/lib/email/templates";
import { getExistingMeetingInvite } from "@/server/data/meeting/invite-queries";
import { createNewNotification } from "@/server/data/user/queries";

export type MeetingInviteInviter = {
	id: string;
	displayName: string | null;
};

/**
 * Ensures meeting_invites row, notifies users by id, inserts availability rows.
 * Caller must enforce auth (host always; members when the meeting allows it).
 * `inviteeUserIds` are auth user ids.
 */
export async function sendMeetingInvitesToUsers(params: {
	meetingId: string;
	meetingTitle: string;
	inviter: MeetingInviteInviter;
	inviteeUserIds: string[];
}): Promise<{ success: true } | { success: false; message: string }> {
	const { meetingId, meetingTitle, inviter, inviteeUserIds } = params;

	if (!inviteeUserIds.length) {
		return { success: false, message: "No members selected." };
	}

	const uniqueInviteeIds = [...new Set(inviteeUserIds)];

	try {
		const invitedUsers = await db
			.select({ memberId: users.memberId, userId: users.id })
			.from(users)
			.where(inArray(users.id, uniqueInviteeIds));

		if (invitedUsers.length === 0) {
			return { success: false, message: "No valid members selected." };
		}

		const resolvedUserIds = invitedUsers.map((u) => u.userId);

		const existingInvite = await getExistingMeetingInvite(meetingId);

		if (!existingInvite) {
			await db.insert(meetingInvites).values({
				meetingId,
				inviteToken: crypto.randomUUID(),
				inviterId: inviter.id,
				sentAt: new Date(),
			});
		}

		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
		const origin = baseUrl.replace(/\/$/, "");
		const meetingLink = `${origin}/availability/${meetingId}`;
		const inviterName = inviter.displayName?.trim() || "Someone";

		await createNewNotification(
			resolvedUserIds,
			meetingTitle,
			`You've been invited to join "${meetingTitle}". Click to view the meeting.`,
			"Meeting Invite",
			meetingLink,
			null,
			inviter.id,
			{
				email: createBrandedTransactionalEmail({
					subject: `Action Required: Add Availability for "${meetingTitle}" on ZotMeet`,
					headline: `${inviterName} invited you to a meeting.`,
					bodyLines: [
						`${inviterName} has invited you to join "${meetingTitle}" on ZotMeet.`,
						`Please share your availability so ${inviterName} can schedule the meeting.`,
					],
					ctaLabel: "Join Meeting",
					ctaUrl: meetingLink,
					footerLearnMoreUrl: `${origin}/`,
					footerTopic: "meetings",
				}),
			},
		);

		await db
			.insert(availabilities)
			.values(
				invitedUsers.map(({ memberId }) => ({
					memberId,
					meetingId,
					meetingAvailabilities: [],
				})),
			)
			.onConflictDoNothing({
				target: [availabilities.memberId, availabilities.meetingId],
			});

		revalidatePath(`/availability/${meetingId}`);
		revalidatePath("/summary");

		return { success: true };
	} catch (error) {
		console.error("Failed to send meeting invites:", error);
		return {
			success: false,
			message: "Failed to send invites. Please try again.",
		};
	}
}
