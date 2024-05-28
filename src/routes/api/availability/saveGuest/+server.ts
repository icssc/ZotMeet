import { sql } from "drizzle-orm";

import { _getMeetingDates } from "../../../availability/[slug]/+page.server";

import { getExistingGuest, getExistingMeeting } from "$lib/db/databaseUtils.server";
import { db } from "$lib/db/drizzle";
import {
  availabilities,
  membersInMeeting,
  type AvailabilityInsertSchema,
  type MeetingDateSelectSchema,
} from "$lib/db/schema";
import type { ZotDate } from "$lib/utils/ZotDate";

export async function POST({ request }: { request: Request }) {
  const formData = await request.formData();

  const availabilityDates: ZotDate[] = JSON.parse(
    (formData.get("availabilityDates") as string) ?? "[]",
  );
  const meetingId = (formData.get("meetingId") as string) ?? "";

  let dbMeetingDates: MeetingDateSelectSchema[] = [];

  try {
    dbMeetingDates = await _getMeetingDates(meetingId);
  } catch (e) {
    console.log("Error getting meeting dates:", e);
  }

  if (!dbMeetingDates || dbMeetingDates.length === 0) return;

  try {
    const memberId = (
      await getExistingGuest(
        formData.get("username") as string,
        await getExistingMeeting(meetingId),
      )
    ).id;

    const insertDates: AvailabilityInsertSchema[] = availabilityDates.map((date, index) => ({
      day: new Date(date.day).toISOString(),
      member_id: memberId,
      meeting_day: dbMeetingDates[index].id as string, // Type-cast since id is guaranteed if a meetingDate exists
      availability_string: date.availability.map((bool) => (bool ? "1" : "0")).join(""),
    }));

    await db.transaction(async (tx) => {
      await Promise.all([
        tx
          .insert(availabilities)
          .values(insertDates)
          .onConflictDoUpdate({
            target: [availabilities.member_id, availabilities.meeting_day],
            set: {
              // `excluded` refers to the row currently in conflict
              availability_string: sql.raw(`excluded.availability_string`),
            },
          }),
        tx
          .insert(membersInMeeting)
          .values({ memberId, meetingId, attending: "maybe" })
          .onConflictDoNothing(),
      ]);
    });

    return new Response("Saved guest availability", {
      status: 200,
    });
  } catch (e) {
    console.log("Error saving availabilities:", e);
    return new Response("Error saving availabilities", {
      status: 500,
    });
  }
}
