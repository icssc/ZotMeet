import { cookies, headers } from "next/headers";
import { google } from "@/lib/auth/oauth";
import { generateCodeVerifier, generateState } from "arctic";

export async function GET(): Promise<Response> {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = new URL(
        google.createAuthorizationURL(state, codeVerifier, [
            "openid",
            "profile",
            "email",
            "https://www.googleapis.com/auth/calendar.readonly",
        ])
    );

    // Requests Google to provide refresh token for silent access token refresh (not natively supported by Arctic)
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent");

    const cookieStore = await cookies();
    cookieStore.set("google_oauth_state", state, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax",
    });
    cookieStore.set("google_code_verifier", codeVerifier, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax",
    });

    const headersList = headers();
    const referer = headersList.get("referer");

    if (referer) {
        cookieStore.set("auth_redirect_url", referer, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 10, // 10 minutes
            sameSite: "lax",
        });
    }

    return new Response(null, {
        status: 302,
        headers: {
            Location: url.toString(),
        },
    });
}
