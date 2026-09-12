import {
	isAllowedNativeRedirectUri,
	NATIVE_OAUTH_CLIENT,
	NATIVE_OAUTH_PARAMS,
	type NativeOAuthLoginParams,
} from "@zotmeet/shared";
import {
	CodeChallengeMethod,
	generateCodeVerifier,
	generateState,
} from "arctic";
import type { cookies, headers } from "next/headers";
import { encodeNativeState } from "@/lib/auth/native-state";
import { getOAuthClient } from "@/lib/auth/oauth";
import {
	getOAuthCallbackRedirectUri,
	OAUTH_LOGIN_CONFIG,
	type OAuthLoginProvider,
} from "@/lib/auth/providers";
import { safeReturnTo } from "@/lib/auth/return-to";
import {
	getNativeIosCallbackRedirectUri,
	isNativeIosAppFromCookies,
} from "@/lib/platform";

type CookieStore = Awaited<ReturnType<typeof cookies>>;
type HeaderStore = Awaited<ReturnType<typeof headers>>;

const AUTHORIZATION_ENDPOINT = "https://auth.icssc.club/authorize";

/**
 * Reads the Expo app's login parameters off the login route's query. Returns
 * `null` for a browser login (no `client=expo`), the parameters when they are
 * complete and the redirect URI is one the app may legitimately own, and
 * throws otherwise — a native login with a bad redirect URI must not fall
 * back to the cookie flow, which would leave the app waiting forever.
 *
 * See `NativeOAuth…` in `@zotmeet/shared` for the flow this starts.
 */
export function parseNativeOAuthLoginParams(
	searchParams: URLSearchParams,
	provider: OAuthLoginProvider,
): NativeOAuthLoginParams | null {
	if (searchParams.get(NATIVE_OAUTH_PARAMS.client) !== NATIVE_OAUTH_CLIENT) {
		return null;
	}

	const state = searchParams.get(NATIVE_OAUTH_PARAMS.state);
	const codeChallenge = searchParams.get(NATIVE_OAUTH_PARAMS.codeChallenge);
	const redirectUri = searchParams.get(NATIVE_OAUTH_PARAMS.redirectUri);
	if (!state || !codeChallenge || !redirectUri) {
		throw new NativeOAuthLoginError("Missing native login parameters");
	}

	const allowDevelopment = process.env.NODE_ENV !== "production";
	if (
		!isAllowedNativeRedirectUri(redirectUri, provider, { allowDevelopment })
	) {
		throw new NativeOAuthLoginError("Redirect URI is not allowed");
	}

	return { state, codeChallenge, redirectUri };
}

export class NativeOAuthLoginError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NativeOAuthLoginError";
	}
}

export async function startOAuthLogin(
	provider: OAuthLoginProvider,
	cookieStore: CookieStore,
	headersList: HeaderStore,
	returnTo?: string | null,
	native: NativeOAuthLoginParams | null = null,
): Promise<Response> {
	const config = OAUTH_LOGIN_CONFIG[provider];

	const isNativeIos = isNativeIosAppFromCookies(cookieStore);
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
	const redirectUri = isNativeIos
		? getNativeIosCallbackRedirectUri(baseUrl, provider)
		: getOAuthCallbackRedirectUri(baseUrl, provider);

	const client = getOAuthClient(redirectUri);

	const cookieOptions = {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 10,
		sameSite: "lax" as const,
	};

	// A native login carries the app's own state and PKCE challenge: the app
	// verifies the state and holds the verifier, so neither is stored here.
	// The one thing the callback must learn — that the login is native, and
	// where to bounce the code — travels inside the state rather than a
	// cookie, which may not survive the trip (see `native-state.ts`).
	let url: URL;
	if (native) {
		url = client.createAuthorizationURL(
			AUTHORIZATION_ENDPOINT,
			encodeNativeState(native),
			[...config.scopes],
		);
		url.searchParams.set("code_challenge_method", "S256");
		url.searchParams.set("code_challenge", native.codeChallenge);
	} else {
		const state = generateState();
		const codeVerifier = generateCodeVerifier();
		url = client.createAuthorizationURLWithPKCE(
			AUTHORIZATION_ENDPOINT,
			state,
			CodeChallengeMethod.S256,
			codeVerifier,
			[...config.scopes],
		);

		cookieStore.set("oauth_state", state, cookieOptions);
		cookieStore.set("oauth_code_verifier", codeVerifier, cookieOptions);
	}
	url.searchParams.set("provider", config.icsscProvider);

	cookieStore.set("oauth_redirect_uri", redirectUri, cookieOptions);

	const redirectAfterAuth =
		safeReturnTo(returnTo) ?? safeReturnTo(headersList.get("referer"));
	console.log("[oauth-start]", {
		provider,
		native: native !== null,
		returnTo,
		referer: headersList.get("referer"),
		redirectAfterAuth,
	});
	if (redirectAfterAuth) {
		cookieStore.set("auth_redirect_url", redirectAfterAuth, cookieOptions);
	}

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString(),
		},
	});
}
