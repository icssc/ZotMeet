import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { 
    groups, 
    type SelectGroup,
    usersInGroup,
    users, 
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
//TODO: get all meetings for a group
//TODO: is a user in group check