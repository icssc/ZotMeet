import "server-only";

import { timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { members, users } from "@/db/schema";
import {
	type SessionValidationResult,
	validateSessionToken,
} from "@/lib/auth/session";
import { type UserProfile, userProfileProjection } from "@/lib/auth/user";

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
 *    named by `MOBILE_DEV_HOST_MEMBER_ID` — the "guest" a developer's phone
 *    uses without going through Google. Local development only — it is
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

	const devMemberId = devMemberIdForToken(token);
	if (devMemberId !== null) return devMemberId;

	const { user } = await validateSessionToken(token);
	return user?.memberId ?? null;
}

/**
 * The session behind a bearer token — the `/api/*` counterpart to
 * `getCurrentSession`. Real session tokens only: the dev token stands in for
 * a member but has no session row to report or revoke, so `/api/auth/logout`
 * has nothing to do for it, and `/api/auth/session` answers for it through
 * `getDevUserFromBearer` instead.
 */
export async function getSessionFromBearer(
	request: Request,
): Promise<SessionValidationResult> {
	const token = readBearerToken(request);
	if (!token) return { session: null, user: null };
	return validateSessionToken(token);
}

/**
 * The profile of the member the dev token stands in for, when the request
 * carries that token — so the app can show the guest as signed in (tab bar,
 * profile screen) rather than only calling `/api/*` as them. `null` for any
 * other token, in production, or when the member has no user row (the seed
 * gives "Seed Admin" one).
 */
export async function getDevUserFromBearer(
	request: Request,
): Promise<UserProfile | null> {
	const token = readBearerToken(request);
	if (!token) return null;

	const devMemberId = devMemberIdForToken(token);
	if (devMemberId === null) return null;

	const [user] = await db
		.select(userProfileProjection)
		.from(users)
		.innerJoin(members, eq(users.memberId, members.id))
		.where(eq(users.memberId, devMemberId))
		.limit(1);
	return user ?? null;
}

/**
 * The member id the dev token stands in for, if `token` is it.
 *
 * The dev token is a shared credential for a single member, so a production
 * server refuses it outright rather than relying on the variables being
 * left unset there. Without this, one stray env var — or a token extracted
 * from a distributed mobile bundle — is a full impersonation of that member.
 */
function devMemberIdForToken(token: string): string | null {
	if (process.env.NODE_ENV === "production") return null;

	const devToken = process.env.MOBILE_DEV_API_TOKEN;
	const devMemberId = process.env.MOBILE_DEV_HOST_MEMBER_ID;
	if (devToken && devMemberId && constantTimeEquals(token, devToken)) {
		return devMemberId;
	}
	return null;
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
