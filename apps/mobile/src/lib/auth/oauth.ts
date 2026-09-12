import * as Crypto from "expo-crypto";

/**
 * The app's side of PKCE. The web app's `oauth.ts` builds an `arctic`
 * `OAuth2Client` that talks to ICSSC directly; the app never does — the web
 * app stays the OIDC client and the app is a PKCE client *of the web app*
 * (see `NativeOAuth…` in `@zotmeet/shared`). All it needs are the three
 * primitives arctic would otherwise provide (`generateState`,
 * `generateCodeVerifier`, `createS256CodeChallenge`), on `expo-crypto`
 * because React Native has no `crypto.subtle`.
 */

const BASE64URL_ALPHABET =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

/** RFC 4648 §5, unpadded — the encoding PKCE (RFC 7636) specifies. */
function encodeBase64Url(bytes: Uint8Array): string {
	let out = "";
	for (let i = 0; i < bytes.length; i += 3) {
		const a = bytes[i];
		const b = bytes[i + 1];
		const c = bytes[i + 2];
		const triple = (a << 16) | ((b ?? 0) << 8) | (c ?? 0);
		out += BASE64URL_ALPHABET[(triple >> 18) & 63];
		out += BASE64URL_ALPHABET[(triple >> 12) & 63];
		if (b !== undefined) out += BASE64URL_ALPHABET[(triple >> 6) & 63];
		if (c !== undefined) out += BASE64URL_ALPHABET[triple & 63];
	}
	return out;
}

function base64ToBase64Url(base64: string): string {
	return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** 32 random bytes, base64url — 43 characters, like arctic's. */
export function generateState(): string {
	return encodeBase64Url(Crypto.getRandomBytes(32));
}

/** Same construction; RFC 7636 wants 43–128 characters of this alphabet. */
export function generateCodeVerifier(): string {
	return encodeBase64Url(Crypto.getRandomBytes(32));
}

/** `BASE64URL(SHA256(verifier))`, the `S256` challenge method. */
export async function createS256CodeChallenge(
	codeVerifier: string,
): Promise<string> {
	const digest = await Crypto.digestStringAsync(
		Crypto.CryptoDigestAlgorithm.SHA256,
		codeVerifier,
		{ encoding: Crypto.CryptoEncoding.BASE64 },
	);
	return base64ToBase64Url(digest);
}
