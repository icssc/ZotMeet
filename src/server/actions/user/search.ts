"use server";

import { getCurrentSession } from "@/lib/auth";
import { searchUsersByEmail } from "@/server/data/user/queries";

export async function searchUsers(query: string) {
	const { user } = await getCurrentSession();
	if (!user) return [];

	return searchUsersByEmail(query, user.id);
}
