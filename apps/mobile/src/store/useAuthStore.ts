import type { OAuthLoginProvider, UserProfile } from "@zotmeet/shared";
import { create } from "zustand";
import { logout } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { getCurrentSession } from "@/lib/auth";
import { handleOAuthCallback } from "@/lib/auth/handle-oauth-callback";
import { deleteSessionToken } from "@/lib/auth/session";
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
 * Providers with a native flow. Apple needs its own — the App Store requires
 * Sign in with Apple to be native, not a web view — so its button is wired
 * but declined until that lands.
 */
const NATIVE_PROVIDERS: readonly OAuthLoginProvider[] = ["google"];

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
		try {
			const session = await getCurrentSession();
			set(
				session
					? { status: "signedIn", user: session.user }
					: { status: "signedOut", user: null },
			);
		} catch (error) {
			// Could not reach the server: keep the token, start signed out, and
			// let a later sign-in or relaunch sort it out.
			console.warn("[auth] could not restore session", error);
			set({ status: "signedOut", user: null });
		}
	},

	signIn: async (provider) => {
		set({ error: null });

		if (!NATIVE_PROVIDERS.includes(provider)) {
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
		try {
			const user = await handleOAuthCallback(url);
			set({ status: "signedIn", user, error: null });
		} catch (error) {
			set({ error: describeError(error) });
		}
	},

	signOut: async () => {
		// The server's copy is best-effort: if it cannot be reached the row
		// lives on until it expires, but the device forgets the token either
		// way, which is what "sign out" means to the user.
		try {
			await logout();
		} catch (error) {
			console.warn("[auth] could not revoke session on server", error);
		}
		await deleteSessionToken();
		set({ status: "signedOut", user: null, error: null });
	},
}));

function describeError(error: unknown): string {
	if (error instanceof ApiError) return error.message;
	if (error instanceof Error) return error.message;
	return "Something went wrong signing in.";
}
