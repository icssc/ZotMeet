import { redirect, type Handle } from "@sveltejs/kit";
import type { HandleServerError } from "@sveltejs/kit";

import { auth } from "$lib/server/lucia";

export const handleError: HandleServerError = async ({ error, event }) => {
  const errorId = crypto.randomUUID();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  event.locals.error = error?.toString() || undefined;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  event.locals.errorStackTrace = error?.stack || undefined;
  event.locals.errorId = errorId;

  return {
    message: "An unexpected error occurred.",
    errorId,
  };
};

export const handle: Handle = async ({ event, resolve }) => {
  const startTimer = Date.now();
  event.locals.startTimer = startTimer;

  event.locals.auth = auth.handleRequest(event);

  if (event.locals?.auth) {
    const session = await event.locals.auth.validate();
    const user = session?.user;
    if (user) {
      event.locals.user = user;
    }

    if (event.route.id?.startsWith("/(protected)")) {
      if (!user) throw redirect(302, "/auth");
      // if (!user.verified) throw redirect(302, "/auth/verify/email");
    }
  }

  const response = await resolve(event);

  return response;
};