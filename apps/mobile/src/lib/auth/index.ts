import type { UserProfile } from "@zotmeet/shared";
import { getSession } from "@/lib/api/auth";
import { ApiError, DEV_API_TOKEN } from "@/lib/api/client";
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
 * replacement. Hence the token read once and handed to `getSession`, so the
 * request cannot silently pick up a newer one; hence
 * `deleteSessionTokenIfCurrent`; and hence the `null` rather than a throw when
 * it declines: this call's token is gone either way, so there is no session
 * *for it* to report.
 *
 * With no stored token, development asks the same question of the dev token
 * (`EXPO_PUBLIC_API_TOKEN`, see `api/client.ts`): the server answers with
 * the guest member it stands for, so the guest is signed in from launch.
 * There is nothing to forget when it declines — the token comes from the
 * environment, not storage — and a sign-out only lasts until the next launch.
 */
export async function getCurrentSession(): Promise<{
	user: UserProfile;
} | null> {
	const storedToken = await getSessionToken();
	const token = storedToken ?? DEV_API_TOKEN ?? null;
	if (token === null) return null;

	try {
		const { user } = await getSession(token);
		return { user };
	} catch (error) {
		if (error instanceof ApiError && error.status === 401) {
			if (storedToken !== null) {
				await deleteSessionTokenIfCurrent(storedToken);
			}
			return null;
		}
		throw error;
	}
}
