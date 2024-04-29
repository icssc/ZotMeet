import { json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

import type { RequestHandler } from "./$types";

import { db } from "$lib/db/drizzle";
import { availabilities, guests } from "$lib/db/schema";

export const POST: RequestHandler = async ({ request }) => {
  console.log("in server api call");
  const data = await request.json();

  console.log(data);

  if (data.guestName === "" || data.meetingId === "") {
    return json(null);
  }

  const [guest] = await db
    .select()
    .from(guests)
    .where(and(eq(guests.username, data.guestName), eq(guests.meeting_id, data.meetingId)));

  if (!guest) {
    return json(null);
  }

  const availability = await db
    .select()
    .from(availabilities)
    .where(eq(availabilities.member_id, guest.id));

  console.log("got availability from db", availability);

  if (availability.length == 0) {
    return json(null);
  }

  return json(availability.sort((a, b) => (a.day < b.day ? -1 : 1)));
};
