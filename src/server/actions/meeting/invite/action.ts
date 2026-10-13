"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import {
	getExistingMeeting,
	isMemberOfMeeting,
} from "@/server/data/meeting/queries";
import {
	sendMeetingInviteEmailsToNonUsers,
	sendMeetingInvitesToUsers,
} from "@/server/data/meeting/send-meeting-invites";
import { resolveInviteEmails } from "@/server/data/user/email-invitees";

export type MeetingInviteActionState = {
	success: boolean;
	message: string;
};

/** @deprecated Use {@link MeetingInviteActionState} */
export type InviteMeetingMembersState = MeetingInviteActionState;

/**
 * `inviteEmails` are UCI directory picks without a ZotMeet account; they're
 * emailed the meeting link (or notified, if they've signed up since).
 */
export async function inviteMeetingMembers(
	meetingId: string,
	memberIds: string[],
	inviteEmails: string[] = [],
): Promise<MeetingInviteActionState> {
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

	// Host may always invite; members may invite when membersCanInvite is enabled
	// and they have an availability row for this meeting.
	const userIsHost = user.memberId === meeting.hostId;
	const userIsMember = userIsHost
		? true
		: await isMemberOfMeeting({
				meetingId,
				memberId: user.memberId,
			});

	if ((!userIsMember || !meeting.membersCanInvite) && !userIsHost) {
		return {
			success: false,
			message: "You do not have permission to invite members to this meeting.",
		};
	}

	if (memberIds.length === 0 && inviteEmails.length === 0) {
		return { success: false, message: "No members selected." };
	}

	if (inviteEmails.length > 50) {
		return { success: false, message: "Too many invites at once." };
	}

	const inviter = { id: user.id, displayName: user.displayName };
	const { userIds: invitedAccountIds, newEmails } =
		await resolveInviteEmails(inviteEmails);
	const inviteeUserIds = [...new Set([...memberIds, ...invitedAccountIds])];

	if (inviteeUserIds.length > 0) {
		const result = await sendMeetingInvitesToUsers({
			meetingId,
			meetingTitle: meeting.title,
			inviter,
			inviteeUserIds,
		});
		if (!result.success) {
			return { success: false, message: result.message };
		}
	} else if (newEmails.length === 0) {
		return { success: false, message: "No valid UCI emails selected." };
	}

	const failed = await sendMeetingInviteEmailsToNonUsers({
		meetingId,
		meetingTitle: meeting.title,
		inviter,
		emails: newEmails,
	});
	if (failed > 0) {
		return {
			success: false,
			message: `Failed to email ${failed} invite${failed === 1 ? "" : "s"}. Please try again.`,
		};
	}

	return { success: true, message: "Invites sent successfully!" };
}

export async function updateMeetingInvitePermissions({
	meetingId,
	membersCanInvite,
}: {
	meetingId: string;
	membersCanInvite: boolean;
}): Promise<MeetingInviteActionState> {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			success: false,
			message: "You must be logged in.",
		};
	}

	let meeting: Awaited<ReturnType<typeof getExistingMeeting>>;
	try {
		meeting = await getExistingMeeting(meetingId);
	} catch {
		return {
			success: false,
			message: "Meeting not found.",
		};
	}

	if (meeting.hostId !== user.memberId) {
		return {
			success: false,
			message: "Only the meeting host can update invite permissions.",
		};
	}

	await db
		.update(meetings)
		.set({
			membersCanInvite,
		})
		.where(eq(meetings.id, meetingId));

	revalidatePath(`/availability/${meetingId}`);
	revalidatePath("/summary");

	return {
		success: true,
		message: "Invite permissions updated.",
	};
}
