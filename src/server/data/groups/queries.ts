import "server-only";

import { and, count, countDistinct, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "@/db";
import {
	availabilities,
	GroupRole,
	groups,
	meetings,
	members,
	type SelectGroup,
	type SelectMeeting,
	scheduledMeetings,
	users,
	usersInGroup,
} from "@/db/schema";

export async function getExistingGroup(
	groupId: string,
	includeArchived = false,
): Promise<SelectGroup> {
	const group = await db.query.groups.findFirst({
		where: includeArchived
			? eq(groups.id, groupId)
			: and(eq(groups.id, groupId), eq(groups.archived, false)),
	});

	if (!group) {
		throw new Error("Group not found");
	}
	return group;
}

export async function getGroupsByUserId(
	userId: string,
	includeArchived = false,
): Promise<SelectGroup[]> {
	return await db
		.select({
			id: groups.id,
			name: groups.name,
			description: groups.description,
			createdAt: groups.createdAt,
			createdBy: groups.createdBy,
			archived: groups.archived,
			icon: groups.icon,
		})
		.from(groups)
		.innerJoin(usersInGroup, eq(groups.id, usersInGroup.groupId))
		.where(
			includeArchived
				? eq(usersInGroup.userId, userId)
				: and(eq(usersInGroup.userId, userId), eq(groups.archived, false)),
		);
}

export async function getUsersInGroup(groupId: string) {
	return await db
		.select({
			userId: users.id,
			memberId: users.memberId,
			email: users.email,
			displayName: members.displayName,
			role: usersInGroup.role,
		})
		.from(users)
		.innerJoin(usersInGroup, eq(users.id, usersInGroup.userId))
		.innerJoin(members, eq(users.memberId, members.id))
		.where(eq(usersInGroup.groupId, groupId));
}

export async function getMeetingsByGroupId(
	groupId: string,
	includeArchived = false,
): Promise<SelectMeeting[]> {
	return await db.query.meetings.findMany({
		where: includeArchived
			? eq(meetings.group_id, groupId)
			: and(eq(meetings.group_id, groupId), eq(meetings.archived, false)),
	});
}

export async function isUserInGroup({
	userId,
	groupId,
}: {
	userId: string;
	groupId: string;
}): Promise<boolean> {
	const userInGroup = await db.query.usersInGroup.findFirst({
		where: and(
			eq(usersInGroup.userId, userId),
			eq(usersInGroup.groupId, groupId),
		),
	});

	return userInGroup !== undefined;
}

export async function isGroupCreator({
	userId,
	groupId,
}: {
	userId: string;
	groupId: string;
}): Promise<boolean> {
	const group = await db.query.groups.findFirst({
		where: and(eq(groups.id, groupId), eq(groups.createdBy, userId)),
	});
	return group !== undefined;
}

export async function isGroupAdmin({
	userId,
	groupId,
}: {
	userId: string;
	groupId: string;
}): Promise<boolean> {
	const userInGroup = await db.query.usersInGroup.findFirst({
		where: and(
			eq(usersInGroup.userId, userId),
			eq(usersInGroup.groupId, groupId),
			eq(usersInGroup.role, GroupRole.ADMIN),
		),
	});
	return userInGroup !== undefined;
}

export async function getGroupNameExists(name: string): Promise<boolean> {
	const group = await db.query.groups.findFirst({
		where: eq(groups.name, name),
	});
	return group !== undefined;
}

export async function getGroupMemberCount(groupId: string): Promise<number> {
	const result = await db
		.select({ count: count() })
		.from(usersInGroup)
		.where(eq(usersInGroup.groupId, groupId));

	return result[0]?.count ?? 0;
}

export type GroupWithDetails = SelectGroup & {
	memberCount: number;
	memberEmails: string[];
	totalMembers: number;
	isCreator: boolean;
	needsAvailability: boolean;
	pendingMeetingName: string | null;
	upcomingMeetingName: string | null;
	ownerEmail: string;
	creatorName: string;
};

export async function getGroupsWithDetails(
	userId: string,
	memberId: string,
): Promise<GroupWithDetails[]> {
	const userGroups = await getGroupsByUserId(userId);

	const groupsWithDetails = await Promise.all(
		userGroups.map(async (group) => {
			const [memberCount, members, groupMeetings] = await Promise.all([
				getGroupMemberCount(group.id),
				getUsersInGroup(group.id),
				getMeetingsByGroupId(group.id),
			]);

			// Check if any meetings in this group need availability from this user
			let needsAvailability = false;
			let pendingMeetingName: string | null = null;
			if (groupMeetings.length > 0) {
				const meetingIds = groupMeetings.map((m) => m.id);
				const userAvailabilities = await db
					.select({ meetingId: availabilities.meetingId })
					.from(availabilities)
					.where(
						and(
							eq(availabilities.memberId, memberId),
							inArray(availabilities.meetingId, meetingIds),
						),
					);

				const respondedMeetingIds = new Set(
					userAvailabilities.map((a) => a.meetingId),
				);
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				const pendingMeeting = groupMeetings.find(
					(m) =>
						!m.scheduled &&
						!respondedMeetingIds.has(m.id) &&
						(m.meetingType === "days" ||
							m.dates.some((d) => new Date(d) >= today)),
				);
				needsAvailability = pendingMeeting !== undefined;
				pendingMeetingName = pendingMeeting?.title ?? null;
			}

			// Check for a scheduled meeting within the next 3 days
			let upcomingMeetingName: string | null = null;
			if (groupMeetings.length > 0) {
				const meetingIds = groupMeetings.map((m) => m.id);
				const now = new Date();
				const threeDaysFromNow = new Date(
					now.getTime() + 3 * 24 * 60 * 60 * 1000,
				);
				const upcoming = await db
					.select({ title: meetings.title })
					.from(scheduledMeetings)
					.innerJoin(meetings, eq(scheduledMeetings.meetingId, meetings.id))
					.where(
						and(
							inArray(scheduledMeetings.meetingId, meetingIds),
							gte(scheduledMeetings.scheduledDate, now),
							lte(scheduledMeetings.scheduledDate, threeDaysFromNow),
						),
					)
					.orderBy(scheduledMeetings.scheduledDate)
					.limit(1);
				upcomingMeetingName = upcoming[0]?.title ?? null;
			}

			const creator = members.find((m) => m.userId === group.createdBy);

			return {
				...group,
				memberCount,
				memberEmails: members.slice(0, 4).map((m) => m.email),
				totalMembers: members.length,
				isCreator: group.createdBy === userId,
				needsAvailability,
				pendingMeetingName,
				upcomingMeetingName,
				ownerEmail: creator?.email ?? "",
				creatorName: creator?.displayName ?? "",
			};
		}),
	);

	return groupsWithDetails;
}

export type MeetingWithStats = SelectMeeting & {
	hostName: string;
	scheduledDate: Date | null;
	totalMembers: number;
	respondedCount: number;
	userHasResponded: boolean;
};

export async function getGroupMeetingsWithStats(
	groupId: string,
	totalMembers: number,
	currentMemberId: string,
): Promise<MeetingWithStats[]> {
	const groupMeetings = await getMeetingsByGroupId(groupId);

	if (groupMeetings.length === 0) {
		return [];
	}

	const meetingIds = groupMeetings.map((m) => m.id);
	const hostIds = Array.from(new Set(groupMeetings.map((m) => m.hostId)));

	// Fetch everything in bulk
	const [responseCounts, userResponses, scheduledBlocks, hosts] =
		await Promise.all([
			// Count responses per meeting
			db
				.select({
					meetingId: availabilities.meetingId,
					respondedCount: countDistinct(availabilities.memberId),
				})
				.from(availabilities)
				.where(inArray(availabilities.meetingId, meetingIds))
				.groupBy(availabilities.meetingId),

			// Check if the current user responded
			db
				.select({ meetingId: availabilities.meetingId })
				.from(availabilities)
				.where(
					and(
						eq(availabilities.memberId, currentMemberId),
						inArray(availabilities.meetingId, meetingIds),
					),
				),

			// Get all scheduled dates for these meetings
			db.query.scheduledMeetings.findMany({
				where: inArray(scheduledMeetings.meetingId, meetingIds),
			}),

			// Get all host names at once
			db.query.members.findMany({
				where: inArray(members.id, hostIds),
			}),
		]);

	const responseMap = new Map(
		responseCounts.map((r) => [r.meetingId, r.respondedCount]),
	);
	const userRespondedSet = new Set(userResponses.map((r) => r.meetingId));
	const scheduledMap = new Map(
		scheduledBlocks.map((s) => [s.meetingId, s.scheduledDate]),
	);
	const hostMap = new Map(hosts.map((h) => [h.id, h.displayName]));

	return groupMeetings.map((meeting) => ({
		...meeting,
		hostName: hostMap.get(meeting.hostId) ?? "Unknown",
		scheduledDate: scheduledMap.get(meeting.id) ?? null,
		totalMembers,
		respondedCount: responseMap.get(meeting.id) ?? 0,
		userHasResponded: userRespondedSet.has(meeting.id),
	}));
}
