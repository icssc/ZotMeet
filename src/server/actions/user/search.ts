"use server";

import { getCurrentSession } from "@/lib/auth";
import { searchUsersByEmailOrUsername } from "@/server/data/user/queries";

export async function searchUsers(query: string) {
	const { user } = await getCurrentSession();
	if (!user) return [];

	return searchUsersByEmailOrUsername(query, user.id);
}
