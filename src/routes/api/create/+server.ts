import { error, json } from "@sveltejs/kit";

import { getUserIdFromSession, insertMeeting } from "$lib/db/databaseUtils.server";
import type { MeetingInsertSchema } from "$lib/db/schema";
import type { CreateMeetingPostParams } from "$lib/types/meetings";

export async function POST({ request }) {
  const { title, description, fromTime, toTime, meetingDates, sessionId }: CreateMeetingPostParams =
    await request.json();

  console.log("Creating meeting:", title, description, fromTime, toTime, meetingDates);

  if (fromTime >= toTime) {
    throw error(400, "From time must be before to time");
  }

  if (meetingDates.length === 0) {
    throw error(400, "At least one date must be provided");
  }

  // Just so we don't get flooded too easily
  if (meetingDates.length > 100) {
    throw error(400, "Too many dates provided");
  }

  const sortedDates = meetingDates
    .map((dateString) => new Date(dateString))
    .sort((a, b) => a.getUTCMilliseconds() - b.getUTCMilliseconds());

  const host_id = sessionId ? await getUserIdFromSession(sessionId) : undefined;

  const meeting: MeetingInsertSchema = {
    title,
    description: description || "",
    from_time: fromTime,
    to_time: toTime,
    host_id,
  };

  try {
    const meetingId = await insertMeeting(meeting, sortedDates);
    return json({ meetingId });
  } catch (err) {
    console.error("Error creating meeting:", err, meeting, sortedDates);
    // TODO: This is unsafe
    throw error(500, `Error creating meeting: ${err.message}`);
  }
}
