"use server";

import { getCurrentSession } from "@/lib/auth";
import {
	searchUsersByDisplayName,
	searchUsersByEmail,
	searchUsersByUsername,
} from "@/server/data/user/queries";

export async function searchUsersEmail(query: string) {
	const { user } = await getCurrentSession();
	if (!user) return [];

	return searchUsersByEmail(query, user.id);
}

export async function searchUsersDisplay(query: string) {
	const { user } = await getCurrentSession();
	if (!user) return [];

	return searchUsersByDisplayName(query, user.id);
}

export async function searchUsersUsername(query: string) {
	const { user } = await getCurrentSession();
	if (!user) return [];

	return searchUsersByUsername(query, user.id);
}
