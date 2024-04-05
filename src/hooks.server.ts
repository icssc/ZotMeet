import type { Handle } from "@sveltejs/kit";

import { deleteSessionCookie } from "$lib/db/authUtils.server";
import { lucia } from "$lib/server/lucia";

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);

  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);

    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
  }

  if (!session) {
    await deleteSessionCookie(lucia, event.cookies);
  }

  event.locals.user = user;
  event.locals.session = session;

  return resolve(event);
};
