"use server";

import { db } from "@/db";
import { groups } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

export async function createGroup(
	name: string,
	description?: string,
): Promise<{ id: string } | { error: string }> {
	const { user } = await getCurrentSession();

	if (!user) {
		return { error: "You must be logged in to create a group." };
	}

	const groupData = {
		name: name.trim(),
		description: description?.trim() || null,
		createdBy: user.id,
		createdAt: new Date(),
	};

	try {
		const [newGroup] = await db
			.insert(groups)
			.values(groupData)
			.returning({ id: groups.id });

		return { id: newGroup.id };
	} catch (error) {
		console.error("Failed to create group:", error);
		return { error: "Failed to create group." };
	}
}
