import { fail, type Cookies } from "@sveltejs/kit";
import { generateId, Scrypt } from "lucia";
import { setError, superValidate } from "sveltekit-superforms/server";

import type { Actions, PageServerLoad } from "./$types";

import { userSchema } from "$lib/config/zod-schemas";
import { createAndSetSession } from "$lib/db/authUtils.server";
import { checkIfEmailExists, insertNewUser } from "$lib/db/databaseUtils.server";
import { lucia } from "$lib/server/lucia";
import type { AlertMessageType } from "$lib/types/auth";

const registerSchema = userSchema.pick({
  displayName: true,
  email: true,
  password: true,
  terms: true,
});

export const load = (async () => {
  return {
    form: await superValidate(registerSchema),
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: register,
};

async function register({ request, cookies }: { request: Request; cookies: Cookies }) {
  const form = await superValidate<typeof registerSchema, AlertMessageType>(
    request,
    registerSchema,
  );

  if (!form.valid) {
    return fail(400, {
      form,
    });
  }

  try {
    const isEmailAlreadyRegistered = await checkIfEmailExists(form.data.email);

    if (isEmailAlreadyRegistered === true) {
      return setError(form, "email", "Email already registered");
    }

    const userId = generateId(15);
    const hashedPassword = await new Scrypt().hash(form.data.password);

    await insertNewUser({
      id: userId,
      displayName: form.data.displayName,
      email: form.data.email,
      password: hashedPassword,
      // authMethods: ["email"],
    });

    await createAndSetSession(lucia, userId, cookies);
  } catch (error) {
    console.error(error);

    return setError(
      form,
      "email",
      `An error occurred while processing your request. Please try again. Error: ${error}`,
    );
  }

  return { form };
}
