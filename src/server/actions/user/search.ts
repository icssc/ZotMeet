"use server";

import { getCurrentSession } from "@/lib/auth";
import { validateGoogleAccessToken } from "@/lib/auth/google";
import {
	type GooglePeopleSearch,
	searchGooglePeople,
	warmGooglePeopleSearch,
} from "@/server/data/user/google-people";
import {
	searchUsersByDisplayName,
	searchUsersByEmail,
	searchUsersByEmails,
	searchUsersByQuery,
	searchUsersByUsername,
} from "@/server/data/user/queries";

export async function searchUsers(query: string) {
	const { user } = await getCurrentSession();
	if (!user) return [];

	return searchUsersByQuery(query, user.id);
}

export type InviteeSearchUser = Awaited<
	ReturnType<typeof searchUsersByQuery>
>[number];

/** Someone from the searcher's Google account with no ZotMeet account. */
export type GoogleOnlyInvitee = {
	email: string;
	displayName: string | null;
	profilePicture: string | null;
};

export type InviteeSearchResult = {
	/** Invitable ZotMeet users: Google matches first, then name/email matches. */
	users: InviteeSearchUser[];
	notOnZotMeet: GoogleOnlyInvitee[];
	/** The session's Google token predates the contacts/directory scopes. */
	googleScopesMissing: boolean;
};

const MAX_NOT_ON_ZOTMEET = 8;

const NO_GOOGLE_RESULTS: GooglePeopleSearch = {
	people: [],
	missingScopes: false,
};

async function searchGooglePeopleForSession(
	query: string,
): Promise<GooglePeopleSearch> {
	const { accessToken } = await validateGoogleAccessToken();
	// Apple sign-ins and failed refreshes have no Google token: search
	// ZotMeet only, as before.
	if (!accessToken) return NO_GOOGLE_RESULTS;

	try {
		return await searchGooglePeople(accessToken, query);
	} catch (e) {
		console.error("Google People search failed", e);
		return NO_GOOGLE_RESULTS;
	}
}

/**
 * Invite search: ZotMeet users by email/username/display name, plus anyone
 * the searcher's Google account knows by that name (contacts, people they've
 * emailed, their Workspace directory) matched to ZotMeet users by email.
 * Google people without a ZotMeet account come back separately — they cannot
 * be invited, only shown.
 */
export async function searchInvitees(
	query: string,
): Promise<InviteeSearchResult> {
	const { user } = await getCurrentSession();
	if (!user) {
		return { users: [], notOnZotMeet: [], googleScopesMissing: false };
	}

	const [textMatches, google] = await Promise.all([
		searchUsersByQuery(query, user.id),
		searchGooglePeopleForSession(query),
	]);

	const googleMatches = await searchUsersByEmails(
		google.people.flatMap((p) => p.emails),
		user.id,
	);
	const userByEmail = new Map(
		googleMatches.map((u) => [u.email.toLowerCase(), u]),
	);

	const users: InviteeSearchUser[] = [];
	const seenUserIds = new Set<string>();
	const notOnZotMeet: GoogleOnlyInvitee[] = [];
	const ownEmail = user.email.toLowerCase();

	for (const person of google.people) {
		if (person.emails.includes(ownEmail)) continue;

		const match = person.emails
			.map((email) => userByEmail.get(email))
			.find((u) => u !== undefined);
		if (match) {
			if (seenUserIds.has(match.id)) continue;
			seenUserIds.add(match.id);
			users.push({
				...match,
				displayName: match.displayName ?? person.displayName,
				profilePicture: match.profilePicture ?? person.profilePicture,
			});
		} else if (notOnZotMeet.length < MAX_NOT_ON_ZOTMEET) {
			notOnZotMeet.push({
				email: person.emails[0],
				displayName: person.displayName,
				profilePicture: person.profilePicture,
			});
		}
	}

	for (const match of textMatches) {
		if (seenUserIds.has(match.id)) continue;
		seenUserIds.add(match.id);
		users.push(match);
	}

	return {
		users,
		notOnZotMeet,
		googleScopesMissing: google.missingScopes,
	};
}

/** Call when an invite search opens; see `warmGooglePeopleSearch`. */
export async function warmInviteeSearch(): Promise<void> {
	const { accessToken } = await validateGoogleAccessToken();
	if (accessToken) await warmGooglePeopleSearch(accessToken);
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
