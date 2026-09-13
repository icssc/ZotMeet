import type { UserProfile } from "@zotmeet/shared";
import { getSession } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import {
	deleteSessionTokenIfCurrent,
	getSessionToken,
} from "@/lib/auth/session";

/**
 * Native counterpart to the web app's `getCurrentSession`. The web version
 * reads the cookie and validates it against the database; this one reads
 * the stored token and asks `GET /api/auth/session`, which runs that same
 * validation. A token the server no longer recognises is forgotten here, so
 * the next launch does not ask again.
 *
 * Network trouble is *not* a sign-out: the token is kept and the error
 * propagates, so a flaky connection at launch does not log the user out.
 *
 * Neither is *someone else's* 401. Only the token this call actually sent is
 * forgotten, because a sign-in can complete while this request is in flight —
 * on Android a callback link can relaunch the app straight into one — and the
 * verdict on a token that has since been replaced says nothing about its
 * replacement. Hence `deleteSessionTokenIfCurrent`, and the `null` rather than
 * a throw when it declines: this call's token is gone either way, so there is
 * no session *for it* to report.
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
			await deleteSessionTokenIfCurrent(token);
			return null;
		}
		throw error;
	}
}
