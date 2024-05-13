import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

import { insertMeeting } from "$lib/db/databaseUtils.server";
import type { MeetingCreationPayload } from "$lib/types/meetings";

/**
 * Create a new meeting
 *
 * NOTE: MeetingCreationPayload currently only contains the start and end times,
 * so we add all dates between the start and end dates.
 *
 * TODO: Add specific dates to the payload and implement the logic to add them to the database
 */
export const POST: RequestHandler = async ({ request }) => {
  const meetingCreationPayload: MeetingCreationPayload = await request.json();
  const { name, startTime, endTime } = meetingCreationPayload;

  const meeting_id = await insertMeeting({
    title: name,
    from_time: new Date(startTime),
    to_time: new Date(endTime),
    scheduled: false,
  });

  return json({ meeting_id });
};
