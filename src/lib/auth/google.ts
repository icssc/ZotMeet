import { getCurrentSession } from "@/lib/auth";
import { updateSessionGoogleTokens } from "@/lib/auth/session";
import { google as googleClient } from "googleapis";

export type GoogleTokenResult =
    | { accessToken: string; error: null }
    | { accessToken: null; error: string };

export async function validateGoogleAccessToken(): Promise<GoogleTokenResult> {
    const { session } = await getCurrentSession();

    if (session === null) {
        return { accessToken: null, error: "Not authenticated" };
    }

    if (!session.googleRefreshToken) {
        return { accessToken: null, error: "No Google refresh token" };
    }

    const now = Date.now();
    if (
        session.googleAccessToken &&
        session.googleAccessTokenExpiresAt!.getTime() > now
    ) {
        return { accessToken: session.googleAccessToken, error: null };
    }

    const auth = new googleClient.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID!,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
        process.env.GOOGLE_OAUTH_REDIRECT_URI!
    );

    auth.setCredentials({ refresh_token: session.googleRefreshToken });

    try {
        const { credentials } = await auth.refreshAccessToken();

        await updateSessionGoogleTokens(session.id, {
            googleAccessToken: credentials.access_token!,
            googleAccessTokenExpiresAt: new Date(
                credentials.expiry_date ?? now + 3600 * 1000
            ),
        });

        return { accessToken: credentials.access_token!, error: null };
    } catch (error) {
        return { accessToken: null, error: "Failed to refresh Google token" };
    }
}
