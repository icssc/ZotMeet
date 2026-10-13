import "server-only";

import { google as googleClient } from "googleapis";
import { validateGoogleAccessToken } from "@/lib/auth/google";

export type DirectoryPerson = {
	email: string;
	displayName: string | null;
	profilePicture: string | null;
};

const UCI_EMAIL_PATTERN = /@([a-z0-9-]+\.)*uci\.edu$/i;

/** Only UCI addresses may receive email invites, so the invite actions can't be used to mail arbitrary inboxes. */
export function isUciEmail(email: string): boolean {
	return UCI_EMAIL_PATTERN.test(email);
}

/**
 * Searches the signed-in user's Google Workspace directory (UCI) by name or
 * email via the People API. Returns [] when there is no Google token, or when
 * the session predates the `directory.readonly` scope — the user has to sign
 * in again to grant it.
 */
export async function searchGoogleDirectory(
	query: string,
	limit = 10,
): Promise<DirectoryPerson[]> {
	const { accessToken } = await validateGoogleAccessToken();
	if (!accessToken) return [];

	const auth = new googleClient.auth.OAuth2();
	auth.setCredentials({ access_token: accessToken });
	const people = googleClient.people({ version: "v1", auth });

	try {
		const res = await people.people.searchDirectoryPeople({
			query,
			readMask: "names,emailAddresses,photos",
			sources: ["DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE"],
			pageSize: limit,
		});

		return (res.data.people ?? []).flatMap((person) => {
			const emails = person.emailAddresses ?? [];
			const email = (
				emails.find((e) => e.metadata?.primary) ?? emails[0]
			)?.value?.toLowerCase();
			if (!email || !isUciEmail(email)) return [];

			return [
				{
					email,
					displayName: person.names?.[0]?.displayName ?? null,
					profilePicture: person.photos?.find((p) => !p.default)?.url ?? null,
				},
			];
		});
	} catch (e) {
		// 403 "insufficient authentication scopes" means the session was
		// created before directory.readonly was requested.
		console.warn("Google directory search failed", e);
		return [];
	}
}
