import "server-only";

import { timingSafeEqual } from "node:crypto";
import { validateSessionToken } from "@/lib/auth/session";

/**
 * Resolves the member behind an `Authorization: Bearer <token>` header, for
 * the `/api/*` route handlers the Expo app calls. The rest of the web app
 * authenticates with the `session` cookie; native clients have no cookie jar
 * worth trusting, so they carry the token in a header instead.
 *
 * Two kinds of token are accepted:
 *
 *  - A real session token — the same value the cookie holds — checked with
 *    `validateSessionToken`. Nothing issues these to a native client yet;
 *    when a mobile login flow does, it lands here without touching the routes.
 *  - The dev token from `MOBILE_DEV_API_TOKEN`, which stands in for the member
 *    named by `MOBILE_DEV_HOST_MEMBER_ID`. Local and preview only: neither
 *    variable may be set in production.
 *
 * Invariant relied on by `src/proxy.ts`: handlers under `/api/*` authenticate
 * only through this helper and never read cookies, which is why that prefix is
 * exempt from the Origin-based CSRF guard.
 */
export async function getMemberIdFromBearer(
	request: Request,
): Promise<string | null> {
	const header = request.headers.get("Authorization");
	if (!header?.startsWith("Bearer ")) return null;

	const token = header.slice("Bearer ".length).trim();
	if (!token) return null;

	const devToken = process.env.MOBILE_DEV_API_TOKEN;
	const devMemberId = process.env.MOBILE_DEV_HOST_MEMBER_ID;
	if (devToken && devMemberId && constantTimeEquals(token, devToken)) {
		return devMemberId;
	}

	const { user } = await validateSessionToken(token);
	return user?.memberId ?? null;
}

function constantTimeEquals(a: string, b: string): boolean {
	const bufferA = Buffer.from(a);
	const bufferB = Buffer.from(b);
	// `timingSafeEqual` throws on a length mismatch; a mismatch is a mismatch.
	return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}
