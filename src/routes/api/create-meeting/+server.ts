import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

import { db } from "$lib/db/drizzle";
import { meetings } from "$lib/db/schema";
import type { MeetingCreationPayload } from "$lib/types/meetings";

type NewMeeting = typeof meetings.$inferInsert;

export const POST: RequestHandler = async ({ request }) => {
  const meetingCreationPayload: MeetingCreationPayload = await request.json();

  await insertNewMeeting(meetingCreationPayload);

  return json("hellos");
};

const insertNewMeeting = async (meetingCreationPayload: MeetingCreationPayload) => {
  const { name, startTime, endTime } = meetingCreationPayload;

  // TODO: remove yy/mm/dd from starttime and endtime

  const newMeeting: NewMeeting = {
    title: name,
    from_time: new Date(),
    to_time: new Date(),
    scheduled: false,
  };

  const newMeetingID = await insertNewMeetingEntry(newMeeting);

  console.log(startTime, endTime, newMeetingID);
};

const insertNewMeetingEntry = async (newMeeting: NewMeeting) => {
  return await db.insert(meetings).values(newMeeting).returning({ insertedID: meetings.id });
};
