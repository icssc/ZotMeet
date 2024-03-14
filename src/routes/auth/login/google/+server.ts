import type { Cookies, RequestHandler } from "@sveltejs/kit";
import { generateCodeVerifier, generateState } from "arctic";

import {
  GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME,
  GOOGLE_OAUTH_STATE_COOKIE_NAME,
} from "$lib/db/authUtils.server";
import { googleOauth } from "$lib/server/lucia";

export const GET: RequestHandler = async ({ cookies }: { cookies: Cookies }) => {
  // Generate a unique state value for the OAuth  process
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  // Create the Google OAuth authorization URL
  const url = await googleOauth.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  // Set a cookie with the state value, to be used for CSRF protection
  cookies.set(GOOGLE_OAUTH_STATE_COOKIE_NAME, state, {
    path: "/", // The cookie will be accessible on all paths
    secure: import.meta.env.PROD, // The cookie will be sent over HTTPS if in production
    httpOnly: true, // The cookie cannot be accessed through client-side script
    maxAge: 60 * 10, // The cookie will expire after 10 minutes
    sameSite: "lax", // The cookie will only be sent with same-site requests or top-level navigations
  });

  // Set a cookie with the code verifier, to be used for PKCE
  cookies.set(GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME, codeVerifier, {
    path: "/",
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
};
