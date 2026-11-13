import {
	isNativeOAuthLoginProvider,
	type OAuthLoginProvider,
	type UserProfile,
} from "@zotmeet/shared";
import { create } from "zustand";
import { logout } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { getCurrentSession } from "@/lib/auth";
import { handleOAuthCallback } from "@/lib/auth/handle-oauth-callback";
import { deleteSessionToken, getSessionToken } from "@/lib/auth/session";
import { startOAuthLogin } from "@/lib/auth/start-oauth-login";

/**
 * Who is signed in. The web app has no equivalent store: every server
 * component asks `getCurrentSession()` per request. A native app holds one
 * session for its whole lifetime, so it is read once at launch (`hydrate`)
 * and kept here for the tab bar and the profile screen to subscribe to.
 *
 * The work itself lives in `lib/auth/`, mirroring the web app's
 * `src/lib/auth/`; this store only sequences it and holds the result.
 */

/**
 * Callback links this process has already acted on. Both deliveries of a
 * link (see `handleOAuthCallback`) go through `completeSignIn`, and the
 * router's can come again much later — on Android `Linking.useURL()` keeps
 * reporting the launch link, so the callback screen can mount with it after
 * the user has since signed out. Whatever the first attempt concluded stands;
 * a repeat neither overwrites a success with "expired" nor replays a success
 * over a sign-out. A few strings per sign-in, never pruned.
 */
const handledCallbackUrls = new Set<string>();

export type AuthStatus =
	/** Launch: the stored session, if any, has not been checked yet. */
	"loading" | "signedOut" | "signedIn";

interface AuthStore {
	status: AuthStatus;
	user: UserProfile | null;
	/** The last sign-in failure, for the sign-in screen. Cleared on retry. */
	error: string | null;
	/** Restores the session from storage. Called once by the root layout. */
	hydrate: () => Promise<void>;
	/** Runs the whole OAuth flow: browser, callback, token exchange. */
	signIn: (provider: OAuthLoginProvider) => Promise<void>;
	/**
	 * Finishes a sign-in from a callback link the router delivered (Android
	 * can hand the link to a fresh process). `signIn` calls this itself when
	 * the in-app browser returns the link directly.
	 */
	completeSignIn: (url: string) => Promise<void>;
	signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
	status: "loading",
	user: null,
	error: null,

	hydrate: async () => {
		// Hydration only ever reports on the token that was already on the device
		// at launch, so it is the weakest claim about who is signed in and it
		// yields to anything newer: if a `completeSignIn` has landed while the
		// session request was in flight, its answer is the current one and this
		// result is stale by definition. `status` leaves "loading" exactly once,
		// so that check is the whole guard.
		const publish = (next: Pick<AuthStore, "status" | "user">) => {
			if (get().status !== "loading") return;
			set(next);
		};

		try {
			const session = await getCurrentSession();
			publish(
				session
					? { status: "signedIn", user: session.user }
					: { status: "signedOut", user: null },
			);
		} catch (error) {
			// Could not reach the server: keep the token, start signed out, and
			// let a later sign-in or relaunch sort it out.
			console.warn("[auth] could not restore session", error);
			publish({ status: "signedOut", user: null });
		}
	},

	signIn: async (provider) => {
		set({ error: null });

		// Apple needs a native flow — the App Store requires Sign in with Apple
		// to be native, not a web view — so its button is wired but declined
		// until that lands (`NATIVE_OAUTH_LOGIN_PROVIDERS` in `@zotmeet/shared`).
		if (!isNativeOAuthLoginProvider(provider)) {
			set({ error: "Sign in with Apple isn't available in the app yet." });
			return;
		}

		try {
			const callbackUrl = await startOAuthLogin(provider);
			// The browser was closed without finishing: not an error to show.
			if (callbackUrl === null) return;
			await get().completeSignIn(callbackUrl);
		} catch (error) {
			set({ error: describeError(error) });
		}
	},

	completeSignIn: async (url) => {
		if (handledCallbackUrls.has(url)) return;
		handledCallbackUrls.add(url);

		try {
			const user = await handleOAuthCallback(url);
			set({ status: "signedIn", user, error: null });
		} catch (error) {
			set({ error: describeError(error) });
		}
	},

	signOut: async () => {
		// Signing out is a local act — the device forgets the token, which is
		// what the word means to the user. Revoking the server's copy is a
		// courtesy sent *after* that, and deliberately not awaited: a request
		// that never answers must not be able to keep someone signed in, and
		// nothing here can answer for the network. Awaiting it used to be safe
		// only as long as it failed; a black-holed connection leaves `fetch`
		// pending rather than rejecting (see `timeoutMs` in `api/client.ts`),
		// which no `catch` can rescue.
		//
		// The token is read before it is deleted and handed to `logout`
		// directly. Reading it inside the request instead would find it already
		// gone, and a logout carrying no token — or, in development, the dev
		// token, which `getSessionFromBearer` refuses on purpose — revokes
		// nothing. If there is no token there is no session row to revoke, so
		// the request is not worth sending at all.
		//
		// A keychain that cannot be read or written is no reason to stay signed
		// in: the local sign-out goes ahead without a token to revoke, and the
		// in-memory copy is dropped even if the stored one could not be.
		let token: string | null = null;
		try {
			token = await getSessionToken();
		} catch (error) {
			console.warn("[auth] could not read session token to revoke", error);
		}
		try {
			await deleteSessionToken();
		} catch (error) {
			console.warn("[auth] could not delete stored session token", error);
		}
		set({ status: "signedOut", user: null, error: null });

		if (token !== null) {
			logout(token).catch((error) => {
				// The row now lives on until it expires. The device is signed
				// out regardless, so there is nothing to tell the user.
				console.warn("[auth] could not revoke session on server", error);
			});
		}
	},
}));

function describeError(error: unknown): string {
	if (error instanceof ApiError) return error.message;
	if (error instanceof Error) return error.message;
	return "Something went wrong signing in.";
}
