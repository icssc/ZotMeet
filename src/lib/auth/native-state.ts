import {
	isAllowedNativeRedirectUri,
	type NativeOAuthLoginParams,
	type OAuthLoginProvider,
} from "@zotmeet/shared";

/**
 * How a native login survives the round trip through ICSSC without a cookie.
 *
 * The browser flow keeps its state and verifier in cookies, which works
 * because the login route and the callback share a host. The Expo app's
 * flow does not have that guarantee: in development the app opens the login
 * route on the machine's LAN address while ICSSC sends the code back to
 * `NEXT_PUBLIC_BASE_URL` (localhost), and no cookie crosses that gap. So the
 * one thing the callback needs to know — that this login is native, and
 * where to bounce the code — rides in the OAuth `state` instead, which
 * ICSSC returns verbatim.
 *
 * The envelope is not signed, and does not need to be: the callback re-checks
 * the redirect URI against the same allowlist the login route applied, so a
 * forged state can only send a code to the app on the user's own device,
 * where it fails the app's state check. That is no weaker than the cookie
 * was — a forged login link could set the cookie too.
 */

const PREFIX = "n.";

type NativeStateEnvelope = {
	/** The state the app chose, returned to it unchanged. */
	s: string;
	/** The app's callback link. */
	r: string;
};

export function encodeNativeState(
	native: Pick<NativeOAuthLoginParams, "state" | "redirectUri">,
): string {
	const envelope: NativeStateEnvelope = {
		s: native.state,
		r: native.redirectUri,
	};
	return `${PREFIX}${Buffer.from(JSON.stringify(envelope)).toString("base64url")}`;
}

/**
 * `null` for a browser-flow state (anything without the prefix), the
 * envelope for a native one whose redirect URI passes the allowlist; a
 * native envelope that does not is treated as absent, and the callback then
 * fails the way an unknown state does.
 */
export function decodeNativeState(
	state: string | null,
	provider: OAuthLoginProvider,
): { state: string; redirectUri: string } | null {
	if (state === null || !state.startsWith(PREFIX)) return null;

	let parsed: unknown;
	try {
		parsed = JSON.parse(
			Buffer.from(state.slice(PREFIX.length), "base64url").toString(),
		);
	} catch {
		return null;
	}
	// Valid JSON is not necessarily an object (`null`, a number, …).
	if (typeof parsed !== "object" || parsed === null) {
		return null;
	}
	const envelope = parsed as Partial<NativeStateEnvelope>;
	if (typeof envelope.s !== "string" || typeof envelope.r !== "string") {
		return null;
	}

	const allowDevelopment = process.env.NODE_ENV !== "production";
	if (!isAllowedNativeRedirectUri(envelope.r, provider, { allowDevelopment })) {
		return null;
	}

	return { state: envelope.s, redirectUri: envelope.r };
}
