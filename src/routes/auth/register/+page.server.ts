import { fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";

import type { RouteParams } from "../$types";

import { userSchema } from "$lib/config/zod-schemas";
import { auth } from "$lib/server/lucia";

const registerSchema = userSchema.pick({
  username: true,
  email: true,
  password: true,
  terms: true,
});

export const load = async (event) => {
  const session = await event.locals.auth.validate();
  if (session) throw redirect(302, "/");
  const form = await superValidate(event, registerSchema);
  return {
    form,
  };
};

export const actions = {
  default: register,
};

async function register(event: RequestEvent<RouteParams, "/auth/register">) {
  const form = await superValidate(event, registerSchema);

  if (!form.valid) {
    return fail(400, {
      form,
    });
  }

  try {
    const token = crypto.randomUUID();

    const user = await auth.createUser({
      key: {
        providerId: "email",
        providerUserId: form.data.email.toLowerCase(),
        password: form.data.password,
      },
      attributes: {
        email: form.data.email.toLowerCase(),
        username: form.data.username,
        token: token,
      },
    });

    const session = await auth.createSession({ userId: user.userId, attributes: {} });
    event.locals.auth.setSession(session);
  } catch (e) {
    console.error(e);
    return setError(form, "email", "An error occurred...");
  }

  return { form };
}
