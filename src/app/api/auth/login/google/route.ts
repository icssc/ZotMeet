import {
	type ApiErrorResponse,
	type NativeOAuthTokenResponse,
	nativeOAuthTokenRequestSchema,
} from "@zotmeet/shared";
import type { OAuth2Tokens } from "arctic";
import { type NextRequest, NextResponse } from "next/server";
import {
	establishOAuthSession,
	exchangeOAuthCode,
} from "@/lib/auth/handle-oauth-callback";
import { getOAuthCallbackRedirectUri } from "@/lib/auth/providers";
import { validateSessionToken } from "@/lib/auth/session";

/**
 * `POST /api/auth/login/google` — the last step of the Expo app's sign-in,
 * and the counterpart to the browser callback at `/auth/login/google/callback`.
 * That callback bounced ICSSC's authorization code to the app; the app sends
 * it back here with the PKCE verifier only it holds. Same exchange with
 * ICSSC, same user lookup, same session row (`establishOAuthSession`); the
 * difference is that the session token goes out in the JSON body instead of
 * the `session` cookie. See `NativeOAuth…` in `@zotmeet/shared`.
 */
export async function POST(request: NextRequest) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json<ApiErrorResponse>(
			{ error: "Invalid JSON" },
			{ status: 400 },
		);
	}

	const parsed = nativeOAuthTokenRequestSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json<ApiErrorResponse>(
			{ error: "Invalid request", issues: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	// The authorization request named the web app's registered callback as
	// its redirect URI (`startOAuthLogin`), so the token request must too.
	const redirectUri = getOAuthCallbackRedirectUri(
		process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
		"google",
	);

	let tokens: OAuth2Tokens;
	try {
		tokens = await exchangeOAuthCode(
			parsed.data.code,
			parsed.data.codeVerifier,
			redirectUri,
		);
	} catch (error) {
		console.log("[api/auth/login/google] invalid credentials", error);
		return NextResponse.json<ApiErrorResponse>(
			{ error: "Invalid authorization code" },
			{ status: 400 },
		);
	}

	const { sessionToken, session } = await establishOAuthSession(
		"google",
		tokens,
	);

	// Re-read through the same projection `GET /api/auth/session` uses, so the
	// app sees one shape of user whichever route it came from.
	const { user } = await validateSessionToken(sessionToken);
	if (!user) {
		return NextResponse.json<ApiErrorResponse>(
			{ error: "Failed to create session" },
			{ status: 500 },
		);
	}

	return NextResponse.json<NativeOAuthTokenResponse>(
		{ token: sessionToken, expiresAt: session.expiresAt.toISOString(), user },
		{ status: 201 },
	);
}
