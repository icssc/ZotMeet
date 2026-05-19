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
import { sendMeetingInvitesToUsers } from "@/server/data/meeting/send-meeting-invites";

export type MeetingInviteActionState = {
	success: boolean;
	message: string;
};

/** @deprecated Use {@link MeetingInviteActionState} */
export type InviteMeetingMembersState = MeetingInviteActionState;

export async function inviteMeetingMembers(
	meetingId: string,
	memberIds: string[],
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

	if (!memberIds || memberIds.length === 0) {
		return { success: false, message: "No members selected." };
	}

	const result = await sendMeetingInvitesToUsers({
		meetingId,
		meetingTitle: meeting.title,
		inviter: { id: user.id, displayName: user.displayName },
		inviteeUserIds: memberIds,
	});

	if (result.success) {
		return { success: true, message: "Invites sent successfully!" };
	}
	return { success: false, message: result.message };
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
