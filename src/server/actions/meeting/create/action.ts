"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { type InsertMeeting, meetings, members, users } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { sortMeetingIsoDatesAsc } from "@/lib/availability/utils";
import { availabilityPathWithOpenInvite } from "@/lib/meeting-open-invite";
import { getUsersInGroup, isUserInGroup } from "@/server/data/groups/queries";
import { sendMeetingInvitesToUsers } from "@/server/data/meeting/send-meeting-invites";

async function maybeAutoInviteGroupMembersForNewMeeting(args: {
	meetingId: string;
	meetingTitle: string;
	groupId: string | null | undefined;
	hostMemberId: string;
}): Promise<void> {
	const { meetingId, meetingTitle, groupId, hostMemberId } = args;
	if (!groupId) return;

	try {
		const [hostUser] = await db
			.select({
				id: users.id,
				displayName: members.displayName,
			})
			.from(users)
			.innerJoin(members, eq(users.memberId, members.id))
			.where(eq(users.memberId, hostMemberId))
			.limit(1);

		if (!hostUser) {
			console.error(
				"maybeAutoInviteGroupMembersForNewMeeting: host user not found for member id",
				hostMemberId,
			);
			return;
		}

		const allowed = await isUserInGroup({
			userId: hostUser.id,
			groupId,
		});
		if (!allowed) {
			console.error(
				"maybeAutoInviteGroupMembersForNewMeeting: host not in group",
				groupId,
			);
			return;
		}

		const groupUsers = await getUsersInGroup(groupId);
		const inviteeUserIds = groupUsers
			.map((r) => r.userId)
			.filter((id) => id !== hostUser.id);

		if (inviteeUserIds.length === 0) return;

		const result = await sendMeetingInvitesToUsers({
			meetingId,
			meetingTitle,
			inviter: { id: hostUser.id, displayName: hostUser.displayName },
			inviteeUserIds,
		});
		if (!result.success) {
			console.error(
				"maybeAutoInviteGroupMembersForNewMeeting:",
				result.message,
			);
		}
	} catch (error) {
		console.error("maybeAutoInviteGroupMembersForNewMeeting:", error);
	}
}

export async function createMeetingFromData(
	meetingData: Omit<InsertMeeting, "hostId">,
	hostId: string,
): Promise<{ id: string } | { error: string }> {
	const {
		title,
		description,
		fromTime,
		toTime,
		timezone,
		dates,
		meetingType,
		group_id,
	} = meetingData;

	if (!dates?.length || new Set(dates).size !== dates.length) {
		return { error: "Invalid meeting dates or times." };
	}

	const normalizedDates = sortMeetingIsoDatesAsc(dates);

	if (group_id) {
		const [hostRow] = await db
			.select({ userId: users.id })
			.from(users)
			.where(eq(users.memberId, hostId))
			.limit(1);

		if (!hostRow) {
			return { error: "Host user not found." };
		}

		const allowed = await isUserInGroup({
			userId: hostRow.userId,
			groupId: group_id,
		});
		if (!allowed) {
			return {
				error: "You do not have permission to create meetings for this group.",
			};
		}
	}

	const meeting: InsertMeeting = {
		title,
		description,
		fromTime,
		toTime,
		timezone,
		hostId,
		dates: normalizedDates,
		meetingType: meetingType || "dates",
		group_id: group_id ?? null,
	};

	try {
		const [newMeeting] = await db
			.insert(meetings)
			.values(meeting)
			.returning({ id: meetings.id });

		await maybeAutoInviteGroupMembersForNewMeeting({
			meetingId: newMeeting.id,
			meetingTitle: title,
			groupId: group_id ?? null,
			hostMemberId: hostId,
		});

		return { id: newMeeting.id };
	} catch (error) {
		console.error("Failed to create meeting:", error);
		return { error: "Failed to create meeting." };
	}
}

export async function createMeeting(meetingData: InsertMeeting) {
	const {
		title,
		description,
		fromTime,
		toTime,
		timezone,
		dates,
		meetingType,
		group_id,
	} = meetingData;

	const { user } = await getCurrentSession();

	if (!user) {
		return { error: "You must be logged in to create a meeting." };
	}
	const hostId = user.memberId;

	if (group_id) {
		const allowed = await isUserInGroup({ userId: user.id, groupId: group_id });
		if (!allowed) {
			return {
				error: "You do not have permission to create meetings for this group.",
			};
		}
	}

	if (!dates?.length || new Set(dates).size !== dates.length) {
		return { error: "Invalid meeting dates or times." };
	}

	const normalizedDates = sortMeetingIsoDatesAsc(dates);

	const meeting: InsertMeeting = {
		title,
		description,
		fromTime,
		toTime,
		timezone,
		hostId,
		dates: normalizedDates,
		meetingType: meetingType || "dates",
		group_id: group_id ?? null,
	};

	const [newMeeting] = await db
		.insert(meetings)
		.values(meeting)
		.returning({ id: meetings.id });

	await maybeAutoInviteGroupMembersForNewMeeting({
		meetingId: newMeeting.id,
		meetingTitle: title,
		groupId: group_id ?? null,
		hostMemberId: hostId,
	});

	redirect(availabilityPathWithOpenInvite(newMeeting.id));
}
