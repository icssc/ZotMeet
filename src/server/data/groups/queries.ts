import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { 
    groups, 
    type SelectGroup,
    usersInGroup 
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
//TODO: get all users in a group
//TODO: get all groups that a user is in
//TODO: get all meetings for a group
//TODO: is a user in group check
