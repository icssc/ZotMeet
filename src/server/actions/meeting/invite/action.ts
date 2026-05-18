"use server";

import { eq } from "drizzle-orm/sql/expressions/conditions";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import {
	getAllMemberAvailability,
	getExistingMeeting,
} from "@/server/data/meeting/queries";
import { sendMeetingInvitesToUsers } from "@/server/data/meeting/send-meeting-invites";

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

	// TODO: Enable check once we add private meetings
	// if (meeting.hostId !== user.memberId) {
	// 	return {
	// 		success: false,
	// 		message: "You do not have permission to invite members to this meeting.",
	// 	};
	// }

	const meetingMembers = await getAllMemberAvailability({ meetingId });
	const userIsMember = meetingMembers.some(
		(member) => member.memberId === user.memberId,
	);
	if (!userIsMember && user.memberId !== meeting.hostId) {
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

export interface UpdateMeetingInvitePermissionsState {
	success: boolean;
	message: string;
}

export async function updateMeetingInvitePermissions({
	meetingId,
	membersCanInvite,
}: {
	meetingId: string;
	membersCanInvite: boolean;
}): Promise<UpdateMeetingInvitePermissionsState> {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			success: false,
			message: "You must be logged in.",
		};
	}

	const meeting = await db.query.meetings.findFirst({
		where: eq(meetings.id, meetingId),
	});

	if (!meeting) {
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

	revalidatePath(`/meetings/${meetingId}`);

	return {
		success: true,
		message: "Invite permissions updated.",
	};
}
