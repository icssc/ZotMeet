import { fail } from "@sveltejs/kit";
import { generateId } from "lucia";
import { setError, superValidate } from "sveltekit-superforms/client";

import { _getMeeting } from "../../availability/[slug]/+page.server";

import { guestSchema } from "$lib/config/zod-schemas";
import {
  checkIfGuestUsernameExists,
  insertNewGuest,
  insertNewMember,
} from "$lib/db/databaseUtils.server";
import type { AlertMessageType } from "$lib/types/auth";

export const _guestSchema = guestSchema.pick({
  username: true,
  meetingId: true,
});

export const actions = {
  default: createGuest,
};

async function createGuest({ request }: { request: Request }) {
  const form = await superValidate<typeof _guestSchema, AlertMessageType>(request, _guestSchema);

  if (!form.valid) {
    return fail(400, { form });
  }

  try {
    const isGuestUsernameAlreadyRegistered = await checkIfGuestUsernameExists(
      form.data.username,
      await _getMeeting(form.data.meetingId),
    );

    if (isGuestUsernameAlreadyRegistered === true) {
      return setError(form, "username", "Guest username already exists");
    }

    const id = generateId(15);
    await insertNewMember({ id: id });
    await insertNewGuest({
      username: form.data.username,
      id: id,
      meeting_id: "e3cf0163-e172-40c5-955a-ae9fa1090dc2", // TODO replace with actual meeting id
    });
  } catch (error) {
    console.error(error);

    return setError(
      form,
      "username",
      `An error occurred while processing your request. Please try again. Error: ${error}`,
    );
  }

  return form.data;
}
