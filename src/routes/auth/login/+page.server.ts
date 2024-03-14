import { fail, type Cookies } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { setError, superValidate } from "sveltekit-superforms/server";

import type { PageServerLoad } from "./$types";

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

export const load = (async () => {
  return {
    userLoginFormData: await superValidate(loginSchema),
  };
}) satisfies PageServerLoad;

export const actions = {
  default: login,
};

async function login({ request, cookies }: { request: Request; cookies: Cookies }) {
  const form = await superValidate<typeof loginSchema, AlertMessageType>(request, loginSchema);

  if (!form.valid) {
    return fail(400, { form });
  }

  const [existingUser] = await db
    .select({
      id: users.id,
      email: users.email,
      password: users.password,
      authMethods: users.authMethods,
    })
    .from(users)
    .where(eq(users.email, form.data.email));

  if (!existingUser) {
    return setError(form, "", "Email not registered");
  }

  let isPasswordValid = false;

  // If the user has a password, it means they registered with email
  if (existingUser.authMethods.includes("email") && existingUser.password) {
    isPasswordValid = await new Argon2id().verify(existingUser.password, form.data.password);
  } else {
    // If the user doesn't have a password, it means they registered with OAuth
    return setError(
      form,
      "",
      "You registered with an OAuth provider. Please use the appropriate login method.",
    );
  }

  if (!isPasswordValid) {
    return setError(form, "password", "Incorrect password");
  }

  await createAndSetSession(lucia, existingUser.id, cookies);

  return { form };
}
