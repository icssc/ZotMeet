"use server";

import { getCurrentSession } from "@/lib/auth";
import { searchGoogleDirectory } from "@/server/data/user/directory";
import {
	getUsersByEmails,
	searchUsersByDisplayName,
	searchUsersByEmail,
	searchUsersByQuery,
	searchUsersByUsername,
} from "@/server/data/user/queries";

export type MemberSearchResult = {
	/** User id, or `email:<address>` for a directory person without an account. */
	id: string;
	email: string;
	username: string | null;
	displayName: string | null;
	profilePicture: string | null;
	/** False for UCI directory people who haven't signed up; they're invited by email. */
	hasAccount: boolean;
};

/**
 * ZotMeet users matching the query, followed by UCI Google directory matches.
 * Directory people who already have an account are returned as that account.
 */
export async function searchUsers(
	query: string,
): Promise<MemberSearchResult[]> {
	const { user } = await getCurrentSession();
	if (!user) return [];

	const [accountMatches, directoryMatches] = await Promise.all([
		searchUsersByQuery(query, user.id),
		searchGoogleDirectory(query),
	]);

	const seenEmails = new Set(
		[user.email, ...accountMatches.map((u) => u.email)].map((e) =>
			e.toLowerCase(),
		),
	);
	const directoryOnly = directoryMatches.filter(
		(p) => !seenEmails.has(p.email),
	);

	// Directory hits whose name in ZotMeet differs from Google's still map to
	// their account.
	const directoryAccounts = await getUsersByEmails(
		directoryOnly.map((p) => p.email),
	);
	const accountEmails = new Set(
		directoryAccounts.map((u) => u.email.toLowerCase()),
	);

	return [
		...[...accountMatches, ...directoryAccounts].map((u) => ({
			...u,
			hasAccount: true,
		})),
		...directoryOnly
			.filter((p) => !accountEmails.has(p.email))
			.map((p) => ({
				id: `email:${p.email}`,
				email: p.email,
				username: null,
				displayName: p.displayName,
				profilePicture: p.profilePicture,
				hasAccount: false,
			})),
	];
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
