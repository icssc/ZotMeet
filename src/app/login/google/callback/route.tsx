import { cookies } from "next/headers";
import { setSessionTokenCookie } from "@/lib/auth/cookies";
import { google } from "@/lib/auth/oauth";
import { createSession, generateSessionToken } from "@/lib/auth/session";
import { createUser } from "@/lib/auth/user";
import { getUserFromGoogleId } from "@/server/data/user/queries";
import { decodeIdToken } from "arctic";
import type { OAuth2Tokens } from "arctic";

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const cookieStore = await cookies();
    const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
    const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;

    console.log("state", state);

    console.log("storedState", storedState);
    console.log("codeVerifier", codeVerifier);

    if (
        code === null ||
        state === null ||
        storedState === null ||
        codeVerifier === null
    ) {
        console.log("null error");
        return new Response(null, {
            status: 400,
        });
    }
    if (state !== storedState) {
        console.log("state does not match stored state");
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
    const claims = decodeIdToken(tokens.idToken());
    const googleUserId = claims.sub;
    const username = claims.name;
    console.log("googleUserId", googleUserId);
    console.log("username", username);

    const existingUser = await getUserFromGoogleId(googleUserId);
    console.log("existingUser", existingUser);
    if (existingUser !== undefined) {
        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, existingUser.id);
        await setSessionTokenCookie(sessionToken, session.expiresAt);
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
            },
        });
    }

    const user = await createUser(googleUserId, username, "oauth pass");

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
        status: 302,
        headers: {
            Location: "/",
        },
    });
}
