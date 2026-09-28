import type { ApiErrorResponse, SessionResponse } from "@zotmeet/shared";
import { type NextRequest, NextResponse } from "next/server";
import { getDevUserFromBearer, getSessionFromBearer } from "@/lib/auth/bearer";

/**
 * A dev-token "session" has no row and therefore no real expiry; the app only
 * reads the value, so any future instant will do.
 */
const DEV_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * `GET /api/auth/session` — the Expo app's `getCurrentSession`. The app
 * calls it on launch with the session token it kept from
 * `POST /api/auth/login/<provider>`, to learn whether that token is still
 * good and who it belongs to. A `401` tells the app to forget the token.
 *
 * In development it also answers for the dev token (`MOBILE_DEV_API_TOKEN`),
 * so the guest member appears signed in throughout the app instead of only
 * being able to call `/api/*`.
 */
export async function GET(request: NextRequest) {
	const { session, user } = await getSessionFromBearer(request);
	if (session) {
		return NextResponse.json<SessionResponse>({
			expiresAt: session.expiresAt.toISOString(),
			user,
		});
	}

	const devUser = await getDevUserFromBearer(request);
	if (devUser) {
		return NextResponse.json<SessionResponse>({
			expiresAt: new Date(Date.now() + DEV_SESSION_TTL_MS).toISOString(),
			user: devUser,
		});
	}

	return NextResponse.json<ApiErrorResponse>(
		{ error: "Unauthorized" },
		{ status: 401 },
	);
}
