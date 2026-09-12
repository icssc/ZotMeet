import type { UserProfile } from "@zotmeet/shared";
import { getSession } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { deleteSessionToken, getSessionToken } from "@/lib/auth/session";

/**
 * Native counterpart to the web app's `getCurrentSession`. The web version
 * reads the cookie and validates it against the database; this one reads
 * the stored token and asks `GET /api/auth/session`, which runs that same
 * validation. A token the server no longer recognises is forgotten here, so
 * the next launch does not ask again.
 *
 * Network trouble is *not* a sign-out: the token is kept and the error
 * propagates, so a flaky connection at launch does not log the user out.
 */
export async function getCurrentSession(): Promise<{
	user: UserProfile;
} | null> {
	const token = await getSessionToken();
	if (token === null) return null;

	try {
		const { user } = await getSession();
		return { user };
	} catch (error) {
		if (error instanceof ApiError && error.status === 401) {
			await deleteSessionToken();
			return null;
		}
		throw error;
	}
}
