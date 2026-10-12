import "server-only";

import { google as googleClient, type people_v1 } from "googleapis";

/** A person found through the signed-in user's Google account. */
export type GooglePerson = {
	displayName: string | null;
	profilePicture: string | null;
	/** Lower-cased, primary first. Never empty. */
	emails: string[];
};

export type GooglePeopleSearch = {
	people: GooglePerson[];
	/**
	 * At least one source refused the token for lacking a scope: the session
	 * predates the People API scopes (or the user unticked them on Google's
	 * consent screen), and only signing in again grants them.
	 */
	missingScopes: boolean;
};

type Source = "contacts" | "directory" | "otherContacts";

/** Earlier sources win when the same person turns up in several. */
const SOURCE_ORDER: Source[] = ["contacts", "directory", "otherContacts"];

const RESULTS_PER_SOURCE = 10;

function peopleApi(accessToken: string): people_v1.People {
	const auth = new googleClient.auth.OAuth2();
	auth.setCredentials({ access_token: accessToken });
	return googleClient.people({ version: "v1", auth });
}

function querySource(
	people: people_v1.People,
	source: Source,
	query: string,
): Promise<people_v1.Schema$Person[]> {
	switch (source) {
		case "contacts":
			// requires contacts.readonly
			return people.people
				.searchContacts({
					query,
					readMask: "names,emailAddresses,photos",
					pageSize: RESULTS_PER_SOURCE,
				})
				.then((res) => (res.data.results ?? []).flatMap((r) => r.person ?? []));
		case "otherContacts":
			// requires contacts.other.readonly; `photos` is not a valid mask here
			return people.otherContacts
				.search({
					query,
					readMask: "names,emailAddresses",
					pageSize: RESULTS_PER_SOURCE,
				})
				.then((res) => (res.data.results ?? []).flatMap((r) => r.person ?? []));
		case "directory":
			// requires directory.readonly; fails for consumer (non-Workspace) accounts
			return people.people
				.searchDirectoryPeople({
					query,
					readMask: "names,emailAddresses,photos",
					sources: [
						"DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE",
						"DIRECTORY_SOURCE_TYPE_DOMAIN_CONTACT",
					],
					pageSize: RESULTS_PER_SOURCE,
				})
				.then((res) => res.data.people ?? []);
	}
}

/**
 * Google answers a token without the scope with a 403 whose detail reason is
 * `ACCESS_TOKEN_SCOPE_INSUFFICIENT`. Other 403s (a Workspace admin hiding the
 * directory, the API disabled on the project) are not something signing in
 * again fixes.
 */
function isMissingScopeError(error: unknown): boolean {
	const err = error as {
		status?: number;
		response?: {
			status?: number;
			data?: {
				error?: { message?: string; details?: { reason?: string }[] };
			};
		};
	};
	const status = err.status ?? err.response?.status;
	if (status !== 403) return false;
	const body = err.response?.data?.error;
	return (
		body?.details?.some(
			(d) => d.reason === "ACCESS_TOKEN_SCOPE_INSUFFICIENT",
		) === true ||
		/insufficient authentication scopes/i.test(body?.message ?? "")
	);
}

function toGooglePerson(person: people_v1.Schema$Person): GooglePerson | null {
	const emails = [...(person.emailAddresses ?? [])]
		.sort((a, b) => Number(b.metadata?.primary) - Number(a.metadata?.primary))
		.flatMap((e) => (e.value ? [e.value.trim().toLowerCase()] : []));
	if (emails.length === 0) return null;

	const name =
		person.names?.find((n) => n.metadata?.primary) ?? person.names?.[0];
	const photo =
		person.photos?.find((p) => p.metadata?.primary && !p.default) ??
		person.photos?.find((p) => !p.default);

	return {
		displayName: name?.displayName ?? null,
		profilePicture: photo?.url ?? null,
		emails: [...new Set(emails)],
	};
}

/**
 * Searches the user's Google contacts, "other contacts" and Workspace
 * directory by name or email prefix. Each source fails on its own — a
 * consumer Gmail account has no directory, a session may lack a scope — so
 * one failing never hides the others' results.
 */
export async function searchGooglePeople(
	accessToken: string,
	query: string,
): Promise<GooglePeopleSearch> {
	const people = peopleApi(accessToken);
	const settled = await Promise.allSettled(
		SOURCE_ORDER.map((source) => querySource(people, source, query)),
	);

	let missingScopes = false;
	const seenEmails = new Set<string>();
	const found: GooglePerson[] = [];

	settled.forEach((result, i) => {
		if (result.status === "rejected") {
			if (isMissingScopeError(result.reason)) {
				missingScopes = true;
			} else if (SOURCE_ORDER[i] !== "directory") {
				// A missing directory is the normal case for personal accounts.
				console.warn(
					`Google People search failed (${SOURCE_ORDER[i]})`,
					result.reason,
				);
			}
			return;
		}

		for (const raw of result.value) {
			const person = toGooglePerson(raw);
			if (!person || person.emails.some((e) => seenEmails.has(e))) continue;
			for (const email of person.emails) seenEmails.add(email);
			found.push(person);
		}
	});

	return { people: found, missingScopes };
}

/**
 * Google asks for an empty-query request before `searchContacts` and
 * `otherContacts.search` so its per-user search cache is fresh; without one
 * the first searches can come back empty. Failures are irrelevant here.
 */
export async function warmGooglePeopleSearch(
	accessToken: string,
): Promise<void> {
	const people = peopleApi(accessToken);
	await Promise.allSettled([
		querySource(people, "contacts", ""),
		querySource(people, "otherContacts", ""),
	]);
}
