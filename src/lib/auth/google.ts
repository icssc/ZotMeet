// biome-ignore-all lint: fix notnull later

import { and, desc, eq, gt, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import type { InsertSession } from "@/db/schema";
import { sessions } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { updateSessionGoogleTokens } from "@/lib/auth/session";

export type ValidateOAuthAccessTokenError =
	| "Not authenticated"
	| "No OAuth refresh token"
	| "No valid session"
	| "Failed to refresh OAuth token";

export type OAuthTokenResult =
	| { accessToken: string; error: null }
	| { accessToken: null; error: ValidateOAuthAccessTokenError };

async function refreshGoogleAccessTokenForSession(
	session: InsertSession,
): Promise<OAuthTokenResult> {
	if (!session.oidcRefreshToken) {
		return { accessToken: null, error: "No OAuth refresh token" };
	}

	const now = Date.now();
	if (
		session.googleAccessToken &&
		session.googleAccessTokenExpiresAt &&
		session.googleAccessTokenExpiresAt.getTime() > now
	) {
		return { accessToken: session.googleAccessToken, error: null };
	}

	try {
		const tokenEndpoint = `${process.env.OIDC_ISSUER_URL}/token`;

		const response = await fetch(tokenEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: session.oidcRefreshToken,
				client_id: process.env.OIDC_CLIENT_ID!,
			}),
		});

		if (!response.ok) {
			throw new Error("Token refresh failed");
		}

		const data = (await response.json()) as {
			google_access_token?: string;
			google_refresh_token?: string;
			google_token_expiry?: number;
		};

		// Extract Google tokens from OIDC refresh response
		const googleAccessToken = data.google_access_token;
		const googleTokenExpiry = data.google_token_expiry
			? new Date(data.google_token_expiry)
			: new Date(now + 3600 * 1000);

		if (!googleAccessToken) {
			throw new Error("No Google access token in refresh response");
		}

		await updateSessionGoogleTokens(session.id!, {
			googleAccessToken,
			googleAccessTokenExpiresAt: googleTokenExpiry,
		});

		return { accessToken: googleAccessToken, error: null };
	} catch {
		return { accessToken: null, error: "Failed to refresh OAuth token" };
	}
}

export async function validateGoogleAccessToken(): Promise<OAuthTokenResult> {
	const { session } = await getCurrentSession();

	if (session === null) {
		return { accessToken: null, error: "Not authenticated" };
	}

	return refreshGoogleAccessTokenForSession(session);
}

export async function getGoogleAccessTokenForUser(
	userId: string,
): Promise<OAuthTokenResult> {
	const now = new Date();

	const candidates = await db
		.select()
		.from(sessions)
		.where(
			and(
				eq(sessions.userId, userId),
				gt(sessions.expiresAt, now),
				isNotNull(sessions.oidcRefreshToken),
			),
		)
		.orderBy(desc(sessions.expiresAt))
		.limit(1);

	if (candidates.length < 1) {
		return { accessToken: null, error: "No valid session" };
	}

	return refreshGoogleAccessTokenForSession(candidates[0]);
}
