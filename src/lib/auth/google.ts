// biome-ignore-all lint: fix notnull later

import { getCurrentSession } from "@/lib/auth";
import { updateSessionGoogleTokens } from "@/lib/auth/session";

export type ValidateOAuthAccessTokenError =
	| "Not authenticated"
	| "No OAuth refresh token"
	| "Failed to refresh OAuth token";

export type OAuthTokenResult =
	| { accessToken: string; scopes?: string[]; error: null }
	| { accessToken: null; scopes: null; error: ValidateOAuthAccessTokenError };

export async function fetchGoogleTokenScopes(
	accessToken: string,
): Promise<string[]> {
	const res = await fetch(
		`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`,
	);

	if (!res.ok) {
		return [];
	}

	const data = await res.json();

	return typeof data.scope === "string" ? data.scope.split(" ") : [];
}

export async function validateGoogleAccessToken(): Promise<OAuthTokenResult> {
	const { session } = await getCurrentSession();

	if (session === null) {
		return { accessToken: null, scopes: null, error: "Not authenticated" };
	}

	if (!session.oidcRefreshToken) {
		return { accessToken: null, scopes: null, error: "No OAuth refresh token" };
	}

	const now = Date.now();
	if (
		session.googleAccessToken &&
		session.googleAccessTokenExpiresAt!.getTime() > now
	) {
		const scopes = await fetchGoogleTokenScopes(session.googleAccessToken);

		return {
			accessToken: session.googleAccessToken,
			scopes,
			error: null,
		};
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

		await updateSessionGoogleTokens(session.id, {
			oauthAccessToken: googleAccessToken,
			oauthAccessTokenExpiresAt: googleTokenExpiry,
		});

		const scopes = await fetchGoogleTokenScopes(googleAccessToken);

		return { accessToken: googleAccessToken, scopes, error: null };
	} catch {
		return {
			accessToken: null,
			scopes: null,
			error: "Failed to refresh OAuth token",
		};
	}
}
