import "server-only";

import { timingSafeEqual } from "node:crypto";
import {
	type SessionValidationResult,
	validateSessionToken,
} from "@/lib/auth/session";

/**
 * Resolves the member behind an `Authorization: Bearer <token>` header, for
 * the `/api/*` route handlers the Expo app calls. The rest of the web app
 * authenticates with the `session` cookie; native clients have no cookie jar
 * worth trusting, so they carry the token in a header instead.
 *
 * Two kinds of token are accepted:
 *
 *  - A real session token — the same value the cookie holds — checked with
 *    `validateSessionToken`. The app gets one from
 *    `POST /api/auth/login/<provider>` at the end of its OAuth flow (see
 *    `NativeOAuth…` in `@zotmeet/shared`).
 *  - The dev token from `MOBILE_DEV_API_TOKEN`, which stands in for the member
 *    named by `MOBILE_DEV_HOST_MEMBER_ID`. Local development only — it is
 *    ignored when `NODE_ENV` is `production`, so setting the variables on a
 *    deployed server (preview included) does not enable it.
 *
 * Invariant relied on by `src/proxy.ts`: handlers under `/api/*` authenticate
 * only through this helper and never read cookies, which is why that prefix is
 * exempt from the Origin-based CSRF guard.
 */
export async function getMemberIdFromBearer(
	request: Request,
): Promise<string | null> {
	const token = readBearerToken(request);
	if (!token) return null;

	// The dev token is a shared credential for a single member, so a production
	// server refuses it outright rather than relying on the variables being
	// left unset there. Without this, one stray env var — or a token extracted
	// from a distributed mobile bundle — is a full impersonation of that member.
	if (process.env.NODE_ENV !== "production") {
		const devToken = process.env.MOBILE_DEV_API_TOKEN;
		const devMemberId = process.env.MOBILE_DEV_HOST_MEMBER_ID;
		if (devToken && devMemberId && constantTimeEquals(token, devToken)) {
			return devMemberId;
		}
	}

	const { user } = await validateSessionToken(token);
	return user?.memberId ?? null;
}

/**
 * The session behind a bearer token — the `/api/*` counterpart to
 * `getCurrentSession`. Real session tokens only: the dev token stands in for
 * a member but has no session row to report or revoke, so `/api/auth/*`
 * treats it as signed out.
 */
export async function getSessionFromBearer(
	request: Request,
): Promise<SessionValidationResult> {
	const token = readBearerToken(request);
	if (!token) return { session: null, user: null };
	return validateSessionToken(token);
}

function readBearerToken(request: Request): string | null {
	const header = request.headers.get("Authorization");
	if (!header?.startsWith("Bearer ")) return null;

	const token = header.slice("Bearer ".length).trim();
	return token || null;
}

function constantTimeEquals(a: string, b: string): boolean {
	const bufferA = Buffer.from(a);
	const bufferB = Buffer.from(b);
	// `timingSafeEqual` throws on a length mismatch; a mismatch is a mismatch.
	return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}
