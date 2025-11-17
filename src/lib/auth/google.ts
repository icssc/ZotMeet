import { getCurrentSession } from "@/lib/auth";
import { updateSessionGoogleTokens } from "@/lib/auth/session";

export type ValidateOAuthAccessTokenError =
    | "Not authenticated"
    | "No OAuth refresh token"
    | "Failed to refresh OAuth token";

export type OAuthTokenResult =
    | { accessToken: string; error: null }
    | { accessToken: null; error: ValidateOAuthAccessTokenError };

export async function validateGoogleAccessToken(): Promise<OAuthTokenResult> {
    const { session } = await getCurrentSession();

    if (session === null) {
        return { accessToken: null, error: "Not authenticated" };
    }

    if (!session.googleRefreshToken) {
        return { accessToken: null, error: "No OAuth refresh token" };
    }

    const now = Date.now();
    if (
        session.googleAccessToken &&
        session.googleAccessTokenExpiresAt!.getTime() > now
    ) {
        return { accessToken: session.googleAccessToken, error: null };
    }

    // Generic OAuth2 token refresh using standard token endpoint
    try {
        const tokenEndpoint = `${process.env.OIDC_ISSUER_URL!}/token`;

        const response = await fetch(tokenEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: session.googleRefreshToken,
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

        return { accessToken: googleAccessToken, error: null };
    } catch {
        return { accessToken: null, error: "Failed to refresh OAuth token" };
    }
}
