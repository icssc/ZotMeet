"use server";

import { getCurrentSession } from "@/lib/auth";
import {
	searchUsersByDisplayName,
	searchUsersByEmail,
	searchUsersByQuery,
	searchUsersByUsername,
} from "@/server/data/user/queries";

export async function searchUsers(query: string) {
	const { user } = await getCurrentSession();
	if (!user) return [];

	return searchUsersByQuery(query, user.id);
}

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
