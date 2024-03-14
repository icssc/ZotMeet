import { redirect, type Cookies } from "@sveltejs/kit";

import { deleteSessionCookie } from "$lib/db/authUtils.server.js";
import { lucia } from "$lib/server/lucia";

export const actions = {
  default: logout,
};

async function logout({ cookies }: { cookies: Cookies }) {
  deleteSessionCookie(lucia, cookies);
  throw redirect(302, "/auth"); // Redirect to auth page
}
