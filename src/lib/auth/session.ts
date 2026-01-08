import { db } from "@/db";
import type { InsertSession } from "@/db/schema";
import { members, sessions, users } from "@/db/schema";
import { UserProfile, userProfileProjection } from "@/lib/auth/user";
import { sha256 } from "@oslojs/crypto/sha2";
import {
	encodeBase32LowerCaseNoPadding,
	encodeHexLowerCase,
} from "@oslojs/encoding";
import { eq } from "drizzle-orm";

const DAYS_MS = 1000 * 60 * 60 * 24;

type OAuthTokenData = {
	oidcAccessToken?: string;
	oidcRefreshToken?: string;
	oauthAccessToken?: string;
	oauthRefreshToken?: string;
	oauthAccessTokenExpiresAt?: Date;
};

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);

	return token;
}

export async function createSession(
	token: string,
	userId: string,
	options: OAuthTokenData = {},
): Promise<InsertSession> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const session: InsertSession = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAYS_MS * 30),
		oidcAccessToken: options.oidcAccessToken,
		oidcRefreshToken: options.oidcRefreshToken,
		googleAccessToken: options.oauthAccessToken,
		googleRefreshToken: options.oauthRefreshToken,
		googleAccessTokenExpiresAt: options.oauthAccessTokenExpiresAt,
	};

	await db.insert(sessions).values(session);
	return session;
}

export async function validateSessionToken(
	token: string,
): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const existingSession = await db
		// use projection to not leak any sensitive data
		.select({
			user: userProfileProjection,
			session: sessions,
		})
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.innerJoin(members, eq(users.memberId, members.id))
		.where(eq(sessions.id, sessionId));

	if (existingSession.length < 1) {
		return { session: null, user: null };
	}

	const { user, session } = existingSession[0];

	// Session has expired
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessions).where(eq(sessions.id, session.id));

		return { session: null, user: null };
	}

	// Renew session if close to expiring
	if (Date.now() >= session.expiresAt.getTime() - DAYS_MS * 15) {
		session.expiresAt = new Date(Date.now() + DAYS_MS * 30);

		await db
			.update(sessions)
			.set({
				expiresAt: session.expiresAt,
			})
			.where(eq(sessions.id, session.id));
	}

	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function updateSessionGoogleTokens(
	sessionId: string,
	tokens: {
		oauthAccessToken: string;
		oauthAccessTokenExpiresAt: Date;
	},
): Promise<void> {
	await db
		.update(sessions)
		.set({
			googleAccessToken: tokens.oauthAccessToken,
			googleAccessTokenExpiresAt: tokens.oauthAccessTokenExpiresAt,
		})
		.where(eq(sessions.id, sessionId));
}

export type SessionValidationResult =
	| { session: InsertSession; user: UserProfile }
	| { session: null; user: null };
