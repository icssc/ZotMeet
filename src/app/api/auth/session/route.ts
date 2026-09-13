import type { ApiErrorResponse, SessionResponse } from "@zotmeet/shared";
import { type NextRequest, NextResponse } from "next/server";
import { getSessionFromBearer } from "@/lib/auth/bearer";

/**
 * `GET /api/auth/session` — the Expo app's `getCurrentSession`. The app
 * calls it on launch with the session token it kept from
 * `POST /api/auth/login/<provider>`, to learn whether that token is still
 * good and who it belongs to. A `401` tells the app to forget the token.
 */
export async function GET(request: NextRequest) {
	const { session, user } = await getSessionFromBearer(request);
	if (!session) {
		return NextResponse.json<ApiErrorResponse>(
			{ error: "Unauthorized" },
			{ status: 401 },
		);
	}

	return NextResponse.json<SessionResponse>({
		expiresAt: session.expiresAt.toISOString(),
		user,
	});
}
