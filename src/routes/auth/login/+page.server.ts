import { fail, redirect, type Cookies } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { setError, superValidate } from "sveltekit-superforms/server";

import { userSchema } from "$lib/config/zod-schemas";
import { createAndSetSession } from "$lib/db/authUtils.server";
import { db } from "$lib/db/drizzle";
import { users } from "$lib/db/schema";
import { lucia } from "$lib/server/lucia";
import type { AlertMessageType } from "$lib/types/auth";

const loginSchema = userSchema.pick({
  email: true,
  password: true,
});

export const load = async (event) => {
  const session = await event.locals.auth.validate();
  if (!session) throw redirect(302, "/auth");

  const form = await superValidate(event, loginSchema);
  return {
    form,
  };
};

export const actions = {
  default: login,
};

async function login({ request, cookies }: { request: Request; cookies: Cookies }) {
  console.log("yay");
  const form = await superValidate<typeof loginSchema, AlertMessageType>(request, loginSchema);

  if (!form.valid) {
    return fail(400, { form });
  }

  const [existingUser] = await db
    .select({
      id: users.id,
      password: users.password,
    })
    .from(users)
    .where(eq(users.email, form.data.email));

  if (!existingUser) {
    return setError(form, "", "Email not registered");
  }

  const validPassword = await new Argon2id().verify(existingUser.password, form.data.password);

  if (!validPassword) {
    return setError(form, "password", "Incorrect password");
  }

  await createAndSetSession(lucia, existingUser.id, cookies);

  return { form };
}
