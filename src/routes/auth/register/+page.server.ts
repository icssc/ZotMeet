import { fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";

// import { sendVerificationEmail } from "$lib/config/email-messages";

import type { RouteParams } from "../$types";

import { userSchema } from "$lib/config/zod-schemas";
import { auth } from "$lib/server/lucia";

const signUpSchema = userSchema.pick({
  displayName: true,
  email: true,
  password: true,
  terms: true,
});

export const load = async (event) => {
  const session = await event.locals.auth.validate();
  if (session) throw redirect(302, "/");
  const form = await superValidate(event, signUpSchema);
  return {
    form,
  };
};

export const actions = {
  default: register,
};

async function register(event: RequestEvent<RouteParams, "/auth/register">) {
  const form = await superValidate(event, signUpSchema);

  if (!form.valid) {
    return fail(400, {
      form,
    });
  }

  try {
    const user = await auth.createUser({
      key: {
        providerId: "email",
        providerUserId: form.data.email.toLowerCase(),
        password: form.data.password,
      },
      attributes: {
        displayName: form.data.displayName.toLowerCase(),
        email: form.data.email.toLowerCase(),
      },
    });

    const session = await auth.createSession({ userId: user.userId, attributes: {} });
    event.locals.auth.setSession(session);
  } catch (e) {
    console.error(e);
    // email already in use
    // might be other type of error but this is most common and this is how lucia docs sets the error to duplicate user
    return setError(form, "email", "A user with that email already exists.");
  }

  return { form };
}
