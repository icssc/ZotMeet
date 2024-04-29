import { eq } from "drizzle-orm";

import type { PageServerLoad } from "./$types";

import { getUserFromSession } from "$lib/db/databaseUtils.server";
import { db } from "$lib/db/drizzle";
import { availabilities, meetingDates, meetings } from "$lib/db/schema";

export const load: PageServerLoad = async ({ cookies }) => {
  const sessionID = cookies.get("session");

  console.log(sessionID, "sessionID");
  const user_id = await getUserFromSession(sessionID);
  console.log(user_id);

  const meetingList = await db
    .select({
      name: meetings.title,
      id: meetings.id,
      startTime: meetings.from_time,
      endTime: meetings.to_time,
      location: meetings.location,
      scheduled: meetings.scheduled,
    })
    .from(availabilities)
    .leftJoin(meetingDates, eq(availabilities.meeting_day, meetingDates.id))
    .leftJoin(meetings, eq(meetings.id, meetingDates.meeting_id))
    .groupBy(meetings.id)
    .where(eq(availabilities.member_id, user_id));
  console.log(meetingList);
  return {
    meetings: meetingList,
  };
};
