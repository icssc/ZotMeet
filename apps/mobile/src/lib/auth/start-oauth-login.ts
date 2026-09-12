import {
	isAllowedNativeRedirectUri,
	nativeOAuthCallbackPath,
	nativeOAuthLoginPath,
	type OAuthLoginProvider,
} from "@zotmeet/shared";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { API_URL } from "@/lib/api/client";
import {
	createS256CodeChallenge,
	generateCodeVerifier,
	generateState,
} from "@/lib/auth/oauth";
import { setPendingLogin } from "@/lib/auth/session";

/**
 * Native counterpart to the web app's `startOAuthLogin`. The web version
 * mints the state and PKCE verifier, stashes them in cookies, and redirects
 * to ICSSC; this one mints them on the device, stashes them in secure
 * storage, and opens *the web app's* login route in an in-app browser with
 * the state and challenge attached, so the web app forwards them to ICSSC on
 * the app's behalf. See `NativeOAuth…` in `@zotmeet/shared` for the whole
 * flow.
 *
 * Resolves with the callback link the browser came back on, `null` if the
 * user closed the browser. `handleOAuthCallback` finishes from there.
 */
export async function startOAuthLogin(
	provider: OAuthLoginProvider,
): Promise<string | null> {
	if (!API_URL) {
		throw new Error(
			"EXPO_PUBLIC_API_URL is not set — copy apps/mobile/.env.example to .env.local.",
		);
	}

	// `zotmeet://auth/…` in a build, `exp://<lan-ip>/--/auth/…` in Expo Go.
	// Given the path without its leading slash: `createURL` keeps one as-is,
	// which on a custom scheme yields `zotmeet:///auth/…` — not the form the
	// allowlist accepts. The server checks this against the same allowlist,
	// so a mismatch is caught here with a readable error rather than as a
	// 400 in the browser.
	const redirectUri = Linking.createURL(
		nativeOAuthCallbackPath(provider).replace(/^\//, ""),
	);
	if (
		!isAllowedNativeRedirectUri(redirectUri, provider, {
			allowDevelopment: __DEV__,
		})
	) {
		throw new Error(
			`Callback link ${redirectUri} is not one the server accepts.`,
		);
	}

	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const codeChallenge = await createS256CodeChallenge(codeVerifier);

	await setPendingLogin({
		provider,
		state,
		codeVerifier,
		startedAt: Date.now(),
	});

	const loginUrl = `${API_URL}${nativeOAuthLoginPath(provider, {
		state,
		codeChallenge,
		redirectUri,
	})}`;

	// An auth session left behind by an earlier attempt (the app came back to
	// the foreground without it resolving) makes the next open throw
	// `WebBrowserAlreadyOpenException`. Dismissing it first turns a retry into
	// a retry. iOS only — Android's custom tab cannot be dismissed from here,
	// and does not linger the same way.
	if (Platform.OS === "ios") {
		WebBrowser.dismissAuthSession();
	}

	const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUri, {
		// A private browsing context that shares no cookies with Safari or with
		// earlier sessions. The web app signs out by sending the browser through
		// ICSSC's end-session endpoint so the next sign-in asks for an account
		// again; here nothing outside the app ever holds an ICSSC or Google
		// session, so the same is true without a logout round trip. iOS only —
		// Android's custom tab shares Chrome's cookies regardless.
		preferEphemeralSession: true,
	});
	return result.type === "success" ? result.url : null;
}
