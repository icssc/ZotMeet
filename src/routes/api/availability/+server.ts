import { json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

import type { RequestHandler } from "./$types";

import { db } from "$lib/db/drizzle";
import { availabilities, guests, meetingDates } from "$lib/db/schema";

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();

  if (data.guestName === "" || data.meetingId === "") {
    return json([]);
  }

  const [guest] = await db
    .select()
    .from(guests)
    .where(and(eq(guests.username, data.guestName), eq(guests.meeting_id, data.meetingId)));

  if (!guest) {
    return json([]);
  }

  const availability = await db
    .select()
    .from(availabilities)
    .innerJoin(meetingDates, eq(availabilities.meeting_day, meetingDates.id))
    .where(
      and(
        eq(availabilities.member_id, guest.id),
        eq(meetingDates.meeting_id, data.meetingId ?? ""),
      ),
    );

  if (availability.length == 0) {
    return json([]);
  }

  return json(availability.sort((a, b) => (a.meeting_dates.date > b.meeting_dates.date ? 1 : -1)));
};
