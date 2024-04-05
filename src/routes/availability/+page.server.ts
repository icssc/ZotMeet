import { superValidate } from "sveltekit-superforms/server";

import { _loginSchema } from "../auth/login/+page.server";

import type { PageServerLoad } from "./$types";

import { guestSchema } from "$lib/config/zod-schemas";

const guestLoginSchema = guestSchema.pick({ username: true });

export const load = (async () => {
  return {
    form: await superValidate(_loginSchema),
    guestForm: await superValidate(guestLoginSchema),
  };
}) satisfies PageServerLoad;
