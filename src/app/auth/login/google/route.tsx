import {
	CodeChallengeMethod,
	generateCodeVerifier,
	generateState,
} from "arctic";
import { cookies, headers } from "next/headers";
import { oauth } from "@/lib/auth/oauth";

export async function GET(request: Request): Promise<Response> {
	const { searchParams } = new URL(request.url);
	const promptValue = searchParams.get("prompt") || "none";
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
	url.searchParams.set("prompt", promptValue);

	const cookieStore = await cookies();

	cookieStore.delete("session");

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

	const headersList = await headers();
	const referer = headersList.get("referer");

	if (referer) {
		cookieStore.set("auth_redirect_url", referer, {
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
