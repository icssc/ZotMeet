"use server";

import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { availabilities, meetingInvites, members, users } from "@/db/schema";
import type { EmailJob } from "@/email/emailProcessor";
import { getCurrentSession } from "@/lib/auth";
import { getExistingMeetingInvite } from "@/server/data/meeting/invite-queries";
import { getExistingMeeting } from "@/server/data/meeting/queries";
import { createNewNotification } from "@/server/data/user/queries";

const sqs = new SQSClient({ region: process.env.AWS_REGION ?? "us-west-1" });

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
		const meetingLink = `${baseUrl}/availability/${meetingId}`;

		await createNewNotification(
			memberIds,
			meeting.title,
			`You've been invited to join "${meeting.title}". Click to view the meeting.`,
			"Meeting Invite",
			meetingLink,
			null,
			user.id,
		);

		// Fetch users who have email notifications enabled
		const emailOptedInUsers = await db
			.select({
				memberId: users.memberId,
				userId: users.id,
				email: users.email,
				emailNotifications: users.emailNotifications,
				displayName: members.displayName,
			})
			.from(users)
			.innerJoin(members, eq(users.memberId, members.id))
			.where(inArray(users.id, memberIds));

		const emailRecipients = emailOptedInUsers.filter(
			(u) => u.emailNotifications,
		);
		if (emailRecipients.length === 0 && emailOptedInUsers.length > 0) {
			console.warn(
				"[ZotMeet invite] No emails queued: invited users have email notifications off — enable under Profile.",
			);
		}

		// If set, all meeting-invite messages go here (for SES / queue testing; remove in production).
		const emailTestTo = process.env.EMAIL_TEST_TO?.trim() || undefined;

		if (emailRecipients.length > 0 && !process.env.EMAIL_QUEUE_URL?.trim()) {
			console.error(
				"[ZotMeet invite] EMAIL_QUEUE_URL is missing in env; localhost cannot enqueue. Add the queue URL from your SST deployment.",
			);
		}

		const enqueueResults = await Promise.allSettled(
			emailRecipients.map((u) => {
				const job: EmailJob = {
					type: "meeting_invite",
					to: emailTestTo ?? u.email,
					data: {
						inviterName: user.displayName,
						meetingTitle: meeting.title,
						meetingDescription: meeting.description ?? "",
						meetingLink,
						recipientName: u.displayName ?? u.email,
					},
				};

				return sqs.send(
					new SendMessageCommand({
						QueueUrl: process.env.EMAIL_QUEUE_URL,
						MessageBody: JSON.stringify(job),
					}),
				);
			}),
		);
		for (const r of enqueueResults) {
			if (r.status === "rejected") {
				console.error("[ZotMeet invite] SQS send failed:", r.reason);
			}
		}

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
