import {
	CodeChallengeMethod,
	generateCodeVerifier,
	generateState,
} from "arctic";
import type { cookies, headers } from "next/headers";
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

export async function startOAuthLogin(
	provider: OAuthLoginProvider,
	cookieStore: CookieStore,
	headersList: HeaderStore,
	returnTo?: string | null,
): Promise<Response> {
	const config = OAUTH_LOGIN_CONFIG[provider];
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const isNativeIos = isNativeIosAppFromCookies(cookieStore);
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
	const redirectUri = isNativeIos
		? getNativeIosCallbackRedirectUri(baseUrl, provider)
		: getOAuthCallbackRedirectUri(baseUrl, provider);

	const client = getOAuthClient(redirectUri);
	const url = new URL(
		client.createAuthorizationURLWithPKCE(
			"https://auth.icssc.club/authorize",
			state,
			CodeChallengeMethod.S256,
			codeVerifier,
			[...config.scopes],
		),
	);
	url.searchParams.set("provider", config.icsscProvider);

	const cookieOptions = {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 10,
		sameSite: "lax" as const,
	};

	cookieStore.set("oauth_state", state, cookieOptions);
	cookieStore.set("oauth_code_verifier", codeVerifier, cookieOptions);
	cookieStore.set("oauth_redirect_uri", redirectUri, cookieOptions);

	const redirectAfterAuth =
		safeReturnTo(returnTo) ?? safeReturnTo(headersList.get("referer"));
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
