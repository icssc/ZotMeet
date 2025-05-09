import { cookies } from "next/headers";
import { setSessionTokenCookie } from "@/lib/auth/cookies";
import { google } from "@/lib/auth/oauth";
import { createSession, generateSessionToken } from "@/lib/auth/session";
import { createGoogleUser } from "@/lib/auth/user";
import { getUserIdExists } from "@/server/data/user/queries";
import { decodeIdToken } from "arctic";
import type { OAuth2Tokens } from "arctic";

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const cookieStore = await cookies();
    const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
    const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;
    const redirectUrl = cookieStore.get("auth_redirect_url")?.value ?? "/";

    cookieStore.delete("auth_redirect_url");

    if (
        code === null ||
        state === null ||
        storedState === null ||
        codeVerifier === null
    ) {
        return new Response(null, {
            status: 400,
        });
    }
    if (state !== storedState) {
        return new Response(null, {
            status: 400,
        });
    }

    let tokens: OAuth2Tokens;
    try {
        tokens = await google.validateAuthorizationCode(code, codeVerifier);
    } catch (e) {
        console.log("invalid credentials", e);
        // Invalid code or client credentials
        return new Response(null, {
            status: 400,
        });
    }
    const claims = decodeIdToken(tokens.idToken()) as {
        sub: string;
        name: string;
        email: string;
    };
    const accessToken = tokens.accessToken();
    const refreshToken = tokens.hasRefreshToken()
        ? tokens.refreshToken()
        : undefined;
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    const googleUserId = claims.sub;
    const username = claims.name;
    const email = claims.email;

    const existingUser = await getUserIdExists(googleUserId);

    if (existingUser !== false) {
        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, googleUserId, {
            googleAccessToken: accessToken,
            googleRefreshToken: refreshToken,
            googleAccessTokenExpiresAt: expiresAt,
        });
        await setSessionTokenCookie(sessionToken, session.expiresAt);
        return new Response(null, {
            status: 302,
            headers: {
                Location: redirectUrl,
            },
        });
    }
    const user = await createGoogleUser(googleUserId, email, username, null);

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id, {
        googleAccessToken: accessToken,
        googleRefreshToken: refreshToken,
        googleAccessTokenExpiresAt: expiresAt,
    });
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
        status: 302,
        headers: {
            Location: redirectUrl,
        },
    });
}
