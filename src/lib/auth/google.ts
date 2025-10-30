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
        const tokenEndpoint = process.env.OIDC_TOKEN_ENDPOINT!;

        const response = await fetch(tokenEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: session.googleRefreshToken,
                client_id: process.env.OIDC_CLIENT_ID!,
                client_secret: process.env.OIDC_CLIENT_SECRET!,
            }),
        });

        if (!response.ok) {
            throw new Error("Token refresh failed");
        }

        const data = await response.json();

        await updateSessionGoogleTokens(session.id, {
            oauthAccessToken: data.access_token,
            oauthAccessTokenExpiresAt: new Date(
                now + (data.expires_in ?? 3600) * 1000
            ),
        });

        return { accessToken: data.access_token, error: null };
    } catch {
        return { accessToken: null, error: "Failed to refresh OAuth token" };
    }
}
