import { redirect } from "@sveltejs/kit";

import { auth } from "$lib/server/lucia";

export const actions = {
  default: logout,
};

interface LogoutInterface {
  locals: App.Locals;
}

async function logout({ locals }: LogoutInterface) {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, "/auth");
  }
  await auth.invalidateSession(session.sessionId); // Invalidate session
  locals.auth.setSession(null); // Remove cookie
  throw redirect(302, "/auth"); // Redirect to auth page
}
