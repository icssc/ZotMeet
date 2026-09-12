import {
	NATIVE_OAUTH_CALLBACK_PARAMS,
	nativeOAuthCallbackPath,
	OAUTH_LOGIN_PROVIDERS,
	type OAuthLoginProvider,
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
 * Two things can deliver the same link — `openAuthSessionAsync` resolving,
 * and the router opening `app/auth/login/<provider>/callback.tsx` — so a
 * link is completed at most once: `takePendingLogin` clears the pending
 * login, and a second call for the same code joins the first's promise.
 */
export class OAuthCallbackError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "OAuthCallbackError";
	}
}

const inFlight = new Map<string, Promise<UserProfile>>();

export function handleOAuthCallback(url: string): Promise<UserProfile> {
	const existing = inFlight.get(url);
	if (existing) return existing;

	const promise = completeLogin(url).finally(() => inFlight.delete(url));
	inFlight.set(url, promise);
	return promise;
}

/** Whether a link is one of the app's OAuth callback links at all. */
export function isOAuthCallbackUrl(url: string): boolean {
	return providerFromCallbackUrl(url) !== null;
}

/**
 * The provider whose callback path a link ends in, or `null`. `Linking.parse`
 * reports the same link differently per environment — a custom-scheme link
 * (`zotmeet://auth/login/…`) has no real host, so `auth` lands in `hostname`
 * with the rest in `path`; an Expo Go link keeps its `/--/` prefix in `path`
 * unless the app has no custom scheme; the web preview has a real host — so
 * the path is rebuilt from both fields and matched on its tail.
 */
function providerFromCallbackUrl(url: string): OAuthLoginProvider | null {
	const { hostname, path } = Linking.parse(url);
	const segments = [hostname, path].filter(
		(part): part is string => typeof part === "string" && part.length > 0,
	);
	if (segments.length === 0) return null;
	const fullPath = `/${segments.join("/").replace(/^\/+/, "")}`;
	return (
		OAUTH_LOGIN_PROVIDERS.find((provider) =>
			fullPath.endsWith(nativeOAuthCallbackPath(provider)),
		) ?? null
	);
}

function readParam(
	params: Linking.ParsedURL["queryParams"],
	name: string,
): string | null {
	const value = params?.[name];
	return typeof value === "string" ? value : null;
}

async function completeLogin(url: string): Promise<UserProfile> {
	const { queryParams } = Linking.parse(url);
	const provider = providerFromCallbackUrl(url);
	if (provider === null) {
		throw new OAuthCallbackError("Not a sign-in callback link");
	}

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
	if (pending === null || pending.provider !== provider) {
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
