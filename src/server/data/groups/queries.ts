import "server-only";

import { and, count, eq } from "drizzle-orm";
import { db } from "@/db";
import {
	groups,
	meetings,
	type SelectGroup,
	type SelectMeeting,
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
		})
		.from(users)
		.innerJoin(usersInGroup, eq(users.id, usersInGroup.userId))
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
