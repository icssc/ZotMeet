import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { setSessionTokenCookie } from "@/lib/auth/cookies";
import { oauth } from "@/lib/auth/oauth";
import { createSession, generateSessionToken } from "@/lib/auth/session";
import { createGoogleUser } from "@/lib/auth/user";
import {
    getUserEmailExists,
    getUserIdExists,
} from "@/server/data/user/queries";
import { decodeIdToken } from "arctic";
import type { OAuth2Tokens } from "arctic";
import { eq } from "drizzle-orm";

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const cookieStore = await cookies();
    const storedState = cookieStore.get("oauth_state")?.value ?? null;
    const codeVerifier = cookieStore.get("oauth_code_verifier")?.value ?? null;
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
        tokens = await oauth.validateAuthorizationCode(
            "https://auth.icssc.club/token",
            code,
            codeVerifier
        );
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

    const oauthUserId = claims.sub;
    const username = claims.name;
    const email = claims.email;

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    });
    if (existingUser) {
        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, existingUser.id, {
            oauthAccessToken: accessToken,
            oauthRefreshToken: refreshToken,
            oauthAccessTokenExpiresAt: expiresAt,
        });
        await setSessionTokenCookie(sessionToken, session.expiresAt);
        return new Response(null, {
            status: 302,
            headers: {
                Location: redirectUrl,
            },
        });
    }

    const user = await createGoogleUser(oauthUserId, email, username, null);

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id, {
        oauthAccessToken: accessToken,
        oauthRefreshToken: refreshToken,
        oauthAccessTokenExpiresAt: expiresAt,
    });
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
        status: 302,
        headers: {
            Location: redirectUrl,
        },
    });
}
