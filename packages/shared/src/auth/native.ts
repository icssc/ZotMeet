import { z } from "zod";
import { OAUTH_LOGIN_CONFIG, type OAuthLoginProvider } from "./providers";
import type { UserProfile } from "./user";

/**
 * The contract between the Expo app and the web app for signing in.
 *
 * The web app stays the OIDC client — it holds the client id and the redirect
 * URIs registered with ICSSC — and the native app becomes a PKCE client *of
 * the web app*. The flow, with the web routes it reuses:
 *
 *  1. The app generates `state` and a PKCE verifier, and opens the web app's
 *     login route in an in-app browser:
 *     `/auth/login/<provider>?client=expo&state=…&code_challenge=…&redirect_uri=…`
 *     (`nativeOAuthLoginPath`). `redirect_uri` is the app's own callback link
 *     (`nativeOAuthCallbackPath` on the app's scheme).
 *  2. The web app's `startOAuthLogin` forwards *the app's* challenge to ICSSC
 *     instead of minting its own verifier, and wraps the app's state and
 *     `redirect_uri` into the OAuth `state` it sends (the web app's
 *     `native-state.ts`) — not a cookie, since the login route and the
 *     callback need not share a host.
 *  3. ICSSC sends the authorization code to the web app's registered callback
 *     as usual. Seeing the envelope, `handleOAuthCallback` does not redeem
 *     the code; it bounces `code` and the app's `state` to `redirect_uri`.
 *  4. The app checks `state`, then redeems the code with its verifier at
 *     `POST /api/auth/login/<provider>` (`NativeOAuthTokenRequest`). The web
 *     app exchanges it with ICSSC, creates the session, and returns the
 *     session token as JSON (`SessionResponse`) rather than as a cookie.
 *
 * The code that crosses the app's deep link is useless without the verifier,
 * which never leaves the app — so a rogue app squatting the URL scheme learns
 * nothing (the RFC 8252 argument). The session token only ever travels over
 * HTTPS in a response body, and afterwards as the bearer token the `/api/*`
 * routes already accept.
 */

/** `client` query value that marks a login as native. */
export const NATIVE_OAUTH_CLIENT = "expo";

/** Query parameter names on the login route, in one place for both sides. */
export const NATIVE_OAUTH_PARAMS = {
	client: "client",
	state: "state",
	codeChallenge: "code_challenge",
	redirectUri: "redirect_uri",
} as const;

/** Query parameter names on the app's callback link. */
export const NATIVE_OAUTH_CALLBACK_PARAMS = {
	code: "code",
	state: "state",
	error: "error",
} as const;

/** The custom URL scheme of a built app (`scheme` in `app.config.ts`). */
export const NATIVE_APP_SCHEME = "zotmeet";

/**
 * Path of the app's callback route, which is the web callback's path so the
 * two file trees line up (`apps/mobile/src/app/auth/login/<provider>/callback.tsx`).
 */
export function nativeOAuthCallbackPath(provider: OAuthLoginProvider): string {
	return OAUTH_LOGIN_CONFIG[provider].callbackPath;
}

export type NativeOAuthLoginParams = {
	state: string;
	/** S256 challenge of the app's PKCE verifier, base64url. */
	codeChallenge: string;
	/** The app's callback link, e.g. `zotmeet://auth/login/google/callback`. */
	redirectUri: string;
};

/** The login route URL a native client opens (path + query, no origin). */
export function nativeOAuthLoginPath(
	provider: OAuthLoginProvider,
	params: NativeOAuthLoginParams,
): string {
	const query = new URLSearchParams({
		[NATIVE_OAUTH_PARAMS.client]: NATIVE_OAUTH_CLIENT,
		[NATIVE_OAUTH_PARAMS.state]: params.state,
		[NATIVE_OAUTH_PARAMS.codeChallenge]: params.codeChallenge,
		[NATIVE_OAUTH_PARAMS.redirectUri]: params.redirectUri,
	});
	return `${OAUTH_LOGIN_CONFIG[provider].loginPath}?${query.toString()}`;
}

/**
 * Whether the web app may send an authorization code to this link. The
 * redirect URI is the one thing in the flow the client chooses, so it is
 * matched against the exact callback paths rather than trusted:
 *
 *  - A built app: `zotmeet://<callbackPath>`.
 *  - In development only, Expo Go (`exp://<host>/--/<callbackPath>`, any
 *    host, since Expo Go is reached by LAN address) and the Expo web preview
 *    on localhost.
 *
 * Written on string prefixes rather than `URL` because React Native's `URL`
 * lacks `searchParams` and hostname parsing for custom schemes, and the app
 * uses this to fail fast before opening a browser.
 */
export function isAllowedNativeRedirectUri(
	redirectUri: string,
	provider: OAuthLoginProvider,
	options: { allowDevelopment: boolean },
): boolean {
	const callbackPath = nativeOAuthCallbackPath(provider);
	// The app passes `createURL` the path without its leading slash so the
	// custom-scheme link comes out as `zotmeet://auth/…` rather than
	// `zotmeet:///auth/…`.
	const schemePath = callbackPath.replace(/^\//, "");

	if (redirectUri === `${NATIVE_APP_SCHEME}://${schemePath}`) {
		return true;
	}

	if (!options.allowDevelopment) {
		return false;
	}

	const expoGo = /^exps?:\/\/[^/?#]+\/--(\/.*)$/.exec(redirectUri);
	if (expoGo?.[1] === callbackPath) {
		return true;
	}

	const webPreview = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)$/.exec(
		redirectUri,
	);
	return webPreview?.[3] === callbackPath;
}

/** Body of `POST /api/auth/login/<provider>`. */
export const nativeOAuthTokenRequestSchema = z.object({
	/** The authorization code the web callback bounced to the app. */
	code: z.string().min(1),
	/** The app's PKCE verifier, whose challenge started the login. */
	codeVerifier: z.string().min(43).max(128),
});

export type NativeOAuthTokenRequest = z.infer<
	typeof nativeOAuthTokenRequestSchema
>;

/**
 * The signed-in state as `GET /api/auth/session` reports it to a bearer
 * token, and the web app's `getCurrentSession` in wire form.
 */
export type SessionResponse = {
	/** ISO instant. The server extends it on use, like the cookie session. */
	expiresAt: string;
	user: UserProfile;
};

/**
 * What `POST /api/auth/login/<provider>` returns on success. `token` is the
 * value the web app would have put in the `session` cookie; the app keeps it
 * and sends it back as `Authorization: Bearer`.
 */
export type NativeOAuthTokenResponse = SessionResponse & {
	token: string;
};
