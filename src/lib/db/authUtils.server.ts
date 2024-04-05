import type { Cookies } from "@sveltejs/kit";
import type { Lucia } from "lucia";

export const GOOGLE_OAUTH_STATE_COOKIE_NAME = "googleOauthState";
export const GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME = "googleOauthCodeVerifier";

export const createAndSetSession = async (lucia: Lucia, userId: string, cookies: Cookies) => {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies.set(sessionCookie.name, sessionCookie.value, {
    path: ".",
    ...sessionCookie.attributes,
  });
};

export const deleteSessionCookie = async (lucia: Lucia, cookies: Cookies) => {
  const sessionCookie = lucia.createBlankSessionCookie();

  cookies.set(sessionCookie.name, sessionCookie.value, {
    path: ".",
    ...sessionCookie.attributes,
  });
};
