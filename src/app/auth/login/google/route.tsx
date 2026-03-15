import {
	CodeChallengeMethod,
	generateCodeVerifier,
	generateState,
} from "arctic";
import { cookies, headers } from "next/headers";
import { oauth } from "@/lib/auth/oauth";

export async function GET(request: Request): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = new URL(
		oauth.createAuthorizationURLWithPKCE(
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

	const cookieStore = await cookies();
	cookieStore.set("oauth_state", state, {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax",
	});
	cookieStore.set("oauth_code_verifier", codeVerifier, {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax",
	});

	const requestUrl = new URL(request.url);
	const redirectParam = requestUrl.searchParams.get("redirect");

	const headersList = await headers();
	const referer = headersList.get("referer");

	const redirectTarget = redirectParam || referer;

	if (redirectTarget) {
		cookieStore.set("auth_redirect_url", redirectTarget, {
			path: "/",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 10, // 10 minutes
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
