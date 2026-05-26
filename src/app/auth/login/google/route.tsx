import {
	CodeChallengeMethod,
	generateCodeVerifier,
	generateState,
} from "arctic";
import { cookies, headers } from "next/headers";
import { getOAuthClient } from "@/lib/auth/oauth";
import {
	getNativeIosRedirectUri,
	isNativeIosAppFromCookies,
} from "@/lib/platform";

export async function GET(): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const cookieStore = await cookies();
	const isNativeIos = isNativeIosAppFromCookies(cookieStore);
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
	const redirectUri = isNativeIos
		? getNativeIosRedirectUri(baseUrl)
		: process.env.GOOGLE_OAUTH_REDIRECT_URI!;

	const client = getOAuthClient(redirectUri);
	const url = new URL(
		client.createAuthorizationURLWithPKCE(
			"https://auth.icssc.club/authorize",
			state,
			CodeChallengeMethod.S256,
			codeVerifier,
			[
				"openid",
				"profile",
				"email",
				"https://www.googleapis.com/auth/calendar.readonly",
			],
		),
	);

	cookieStore.set("oauth_state", state, {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 10,
		sameSite: "lax",
	});
	cookieStore.set("oauth_code_verifier", codeVerifier, {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 10,
		sameSite: "lax",
	});
	if (isNativeIos) {
		cookieStore.set("oauth_redirect_uri", redirectUri, {
			path: "/",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 10,
			sameSite: "lax",
		});
	}

	const headersList = await headers();
	const referer = headersList.get("referer");

	if (referer) {
		cookieStore.set("auth_redirect_url", referer, {
			path: "/",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 10,
			sameSite: "lax",
		});
	}

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString(),
		},
	});
}
