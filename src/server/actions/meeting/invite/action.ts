"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { meetingInvites } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
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
		const meetingLink = `${baseUrl}/availability/${meetingId}`;

		await createNewNotification(
			memberIds,
			meeting.title,
			`You've been invited to join "${meeting.title}". Click to view the meeting.`,
			"Meeting Invite",
			meetingLink,
		);

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
