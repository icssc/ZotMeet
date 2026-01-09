import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { 
    groups, 
    type SelectGroup,
    usersInGroup,
    users,
    meetings,
    type SelectMeeting 
} from "@/db/schema";

export async function getExistingGroup(groupId: string): Promise<SelectGroup> {
	const group = await db.query.groups.findFirst({
		where: eq(groups.id, groupId),
	});

	if (!group) {
		throw new Error("Group not found");
	}
	return group;
}

export async function getGroupsByUserId(
	userId: string,
): Promise<SelectGroup[]> {
	return await db
		.select({
			id: groups.id,
			name: groups.name,
			description: groups.description,
			createdAt: groups.createdAt,
			createdBy: groups.createdBy,
		})
		.from(groups)
		.innerJoin(usersInGroup, eq(groups.id, usersInGroup.groupId))
		.where(eq(usersInGroup.userId, userId));
}

export async function getUsersInGroup(groupId:string){
    return await db.select({
        userId: users.id,
        memberId: users.memberId,
        email: users.email,
    })
    .from(users)
    .innerJoin(usersInGroup, eq(users.id, usersInGroup.userId))
    .where(eq(usersInGroup.groupId,groupId))
}

export async function getMeetingsByGroupId(
	groupId: string,
): Promise<SelectMeeting[]> {
	return await db.query.meetings.findMany({
		where: and(eq(meetings.group_id, groupId), eq(meetings.archived, false)),
	});
}
//TODO: is a user in group check