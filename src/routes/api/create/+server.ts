import { error, json } from "@sveltejs/kit";

import { insertMeeting } from "$lib/db/databaseUtils.server";
import type { MeetingInsertSchema } from "$lib/db/schema";
import type { HourMinuteString } from "$lib/types/chrono.js";
import type { CreateMeetingPostParams } from "$lib/types/meetings";

export async function POST({ request }) {
  const { title, description, fromTime, toTime, meetingDates }: CreateMeetingPostParams =
    await request.json();

  console.log("Creating meeting:", title, description, fromTime, toTime, meetingDates);

  if (fromTime >= toTime) {
    error(400, "From time must be before to time");
  }

  if (meetingDates.length === 0) {
    error(400, "At least one date must be provided");
  }

  // Just so we don't get flooded too easily
  if (meetingDates.length > 100) {
    error(400, "Too many dates provided");
  }

  const sortedDates = meetingDates
    .map((dateString) => new Date(dateString))
    .sort((a, b) => a.getUTCMilliseconds() - b.getUTCMilliseconds());

  const firstDate = sortedDates[0];
  const lastDate = sortedDates[sortedDates.length - 1];

  const meeting: MeetingInsertSchema = {
    title,
    description: description || "",
    from_time: dateWithHourMinute(firstDate, fromTime),
    to_time: dateWithHourMinute(lastDate, toTime),
  };

  try {
    const meetingId = await insertMeeting(meeting, sortedDates);
    return json({ meetingId });
  } catch (err) {
    console.log("Error creating meeting:", err);
    error(500, "Error creating meeting");
  }
}

function dateWithHourMinute(date: Date, time: HourMinuteString) {
  const [hour, minute] = time.split(":").map((t) => parseInt(t, 10));
  const newDate = new Date(date);
  date.setHours(hour, minute, 0, 0);
  return newDate;
}
