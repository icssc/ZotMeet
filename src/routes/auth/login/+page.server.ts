import { fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";

import { userSchema } from "$lib/config/zod-schemas";
import { auth } from "$lib/server/lucia";

const loginSchema = userSchema.pick({
  email: true,
  password: true,
});

export const load = async (event) => {
  const session = await event.locals.auth.validate();
  if (session) throw redirect(302, "/");

  const form = await superValidate(event, loginSchema);
  return {
    form,
  };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, loginSchema);
    // console.log(form);

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    //add user to db
    try {
      const key = await auth.useKey("email", form.data.email.toLowerCase(), form.data.password);

      const session = await auth.createSession({
        userId: key.userId,
        attributes: {},
      });

      event.locals.auth.setSession(session);
    } catch (e) {
      //TODO: need to return error message to client
      console.error(e);
      // email already in use
      //const { fieldErrors: errors } = e.flatten();
      return setError(form, "", "The email or password is incorrect.");
    }

    return { form };
  },
};
