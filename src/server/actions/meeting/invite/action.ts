"use server";

import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { availabilities, meetingInvites, users } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { createBrandedTransactionalEmail } from "@/lib/email/templates";
import { getExistingMeetingInvite } from "@/server/data/meeting/invite-queries";
import { getExistingMeeting } from "@/server/data/meeting/queries";
import { createNewNotification } from "@/server/data/user/queries";

export type InviteMeetingMembersState = {
	success: boolean;
	message: string;
};

export async function inviteMeetingMembers(
	meetingId: string,
	memberIds: string[],
): Promise<InviteMeetingMembersState> {
	const { user } = await getCurrentSession();
	if (!user) {
		return { success: false, message: "Not logged in." };
	}

	let meeting: Awaited<ReturnType<typeof getExistingMeeting>>;
	try {
		meeting = await getExistingMeeting(meetingId);
	} catch {
		return { success: false, message: "Meeting not found." };
	}

	if (meeting.hostId !== user.memberId) {
		return {
			success: false,
			message: "You do not have permission to invite members to this meeting.",
		};
	}

	if (!memberIds || memberIds.length === 0) {
		return { success: false, message: "No members selected." };
	}

	try {
		let invite = await getExistingMeetingInvite(meetingId);

		if (!invite) {
			const [newInvite] = await db
				.insert(meetingInvites)
				.values({
					meetingId,
					inviteToken: crypto.randomUUID(),
					inviterId: user.id,
					sentAt: new Date(),
				})
				.returning();
			invite = newInvite;
		}

		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
		const origin = baseUrl.replace(/\/$/, "");
		const meetingLink = `${origin}/availability/${meetingId}`;
		const inviterName = user.displayName?.trim() || "Someone";

		await createNewNotification(
			memberIds,
			meeting.title,
			`You've been invited to join "${meeting.title}". Click to view the meeting.`,
			"Meeting Invite",
			meetingLink,
			null,
			user.id,
			{
				email: createBrandedTransactionalEmail({
					subject: `Action Required: Add Availability for "${meeting.title}" on ZotMeet`,
					headline: `${inviterName} invited you to a meeting.`,
					bodyLines: [
						`${inviterName} has invited you to join "${meeting.title}" on ZotMeet.`,
						`Please share your availability so ${inviterName} can schedule the meeting.`,
					],
					ctaLabel: "Join Meeting",
					ctaUrl: meetingLink,
					footerLearnMoreUrl: `${origin}/`,
					footerTopic: "meetings",
				}),
			},
		);

		const invitedUsers = await db
			.select({ memberId: users.memberId, userId: users.id })
			.from(users)
			.where(inArray(users.id, memberIds));

		if (invitedUsers.length === 0) {
			return { success: false, message: "No valid members selected." };
		}

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

		return { success: true, message: "Invites sent successfully!" };
	} catch (error) {
		console.error("Failed to send meeting invites:", error);
		return {
			success: false,
			message: "Failed to send invites. Please try again.",
		};
	}
}
