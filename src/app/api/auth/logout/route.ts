import { type NextRequest, NextResponse } from "next/server";
import { getSessionFromBearer } from "@/lib/auth/bearer";
import { invalidateSession } from "@/lib/auth/session";

/**
 * `POST /api/auth/logout` — the Expo app's counterpart to the `logoutAction`
 * server action (`src/server/actions/auth/logout/action.ts`): same
 * `invalidateSession`, minus the cookie to clear and the OIDC logout
 * redirect, which only make sense in a browser. Idempotent: a token that is
 * already invalid is a `204` too, so the app can always forget it.
 */
export async function POST(request: NextRequest) {
	const { session } = await getSessionFromBearer(request);
	if (session) {
		await invalidateSession(session.id);
	}
	return new NextResponse(null, { status: 204 });
}
