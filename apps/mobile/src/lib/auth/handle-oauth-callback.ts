import {
	matchNativeRedirectUri,
	NATIVE_OAUTH_CALLBACK_PARAMS,
	type UserProfile,
} from "@zotmeet/shared";
import * as Linking from "expo-linking";
import { exchangeOAuthCode } from "@/lib/api/auth";
import { setSessionToken, takePendingLogin } from "@/lib/auth/session";

/**
 * Native counterpart to the web app's `handleOAuthCallback`. The web version
 * receives ICSSC's authorization code, redeems it, and sets the session
 * cookie. Here the code arrives on the app's callback link (bounced by the
 * web callback), is checked against the state this device chose, and is
 * redeemed through `POST /api/auth/login/<provider>` with the verifier that
 * never left the device. The session token that comes back is stored where
 * `apiFetch` will find it.
 *
 * A link must be completed at most once — a code is single-use, and
 * `takePendingLogin` clears the pending login on the first attempt — but two
 * things can deliver the same one (`openAuthSessionAsync` resolving, and the
 * router opening `app/auth/login/<provider>/callback.tsx`). This function
 * does not de-duplicate; `useAuthStore.completeSignIn`, its only caller,
 * does, since it also owns the state a repeat must not overwrite.
 */
export class OAuthCallbackError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "OAuthCallbackError";
	}
}

export function handleOAuthCallback(url: string): Promise<UserProfile> {
	return completeLogin(url);
}

/**
 * Whether a link is one of the app's OAuth callback links at all: the same
 * allowlist the web app applied before bouncing a code here, so a deep link
 * that merely ends in a callback path is not one.
 */
export function isOAuthCallbackUrl(url: string): boolean {
	return matchNativeRedirectUri(url, { allowDevelopment: __DEV__ }) !== null;
}

function readParam(
	params: Linking.ParsedURL["queryParams"],
	name: string,
): string | null {
	const value = params?.[name];
	return typeof value === "string" ? value : null;
}

async function completeLogin(url: string): Promise<UserProfile> {
	const match = matchNativeRedirectUri(url, { allowDevelopment: __DEV__ });
	if (match === null) {
		throw new OAuthCallbackError("Not a sign-in callback link");
	}
	const { provider, redirectUri } = match;
	const { queryParams } = Linking.parse(url);

	const error = readParam(queryParams, NATIVE_OAUTH_CALLBACK_PARAMS.error);
	const code = readParam(queryParams, NATIVE_OAUTH_CALLBACK_PARAMS.code);
	const state = readParam(queryParams, NATIVE_OAUTH_CALLBACK_PARAMS.state);

	// Cleared whether or not the rest succeeds: a code is single-use, and a
	// stale pending login must not be able to match a later, unrelated link.
	const pending = await takePendingLogin();

	if (error !== null) {
		throw new OAuthCallbackError(
			error === "access_denied" ? "Sign-in was cancelled" : "Sign-in failed",
		);
	}
	if (code === null || state === null) {
		throw new OAuthCallbackError("Sign-in response was incomplete");
	}
	if (
		pending === null ||
		pending.provider !== provider ||
		pending.redirectUri !== redirectUri
	) {
		throw new OAuthCallbackError("Sign-in expired — please try again");
	}
	if (pending.state !== state) {
		throw new OAuthCallbackError("Sign-in response did not match");
	}

	const { token, user } = await exchangeOAuthCode(provider, {
		code,
		codeVerifier: pending.codeVerifier,
	});
	await setSessionToken(token);
	return user;
}
