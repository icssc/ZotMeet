import { eq, min, max } from "drizzle-orm";

import type { PageServerLoad } from "./$types";

import { getUserIdFromSession } from "$lib/db/databaseUtils.server";
import { db } from "$lib/db/drizzle";
import { availabilities, meetingDates, meetings } from "$lib/db/schema";
import type { ScheduledMeeting, UnscheduledMeeting } from "$lib/types/meetings";

export const load: PageServerLoad = async ({ cookies }) => {
  // get user id from session
  const sessionID = cookies.get("session")!;
  const user_id = await getUserIdFromSession(sessionID);

  const meetingList = await db
    .select({
      name: meetings.title,
      id: meetings.id,
      startTime: meetings.from_time,
      endTime: meetings.to_time,
      location: meetings.location,
      scheduled: meetings.scheduled,
      startDate: min(meetingDates.date),
      endDate: max(meetingDates.date),
    })
    .from(availabilities)
    .leftJoin(meetingDates, eq(availabilities.meeting_day, meetingDates.id))
    .leftJoin(meetings, eq(meetings.id, meetingDates.meeting_id))
    .groupBy(meetings.id)
    .where(eq(availabilities.member_id, user_id));

  console.log(meetingList);

  const scheduledMeetings = meetingList.filter((meeting) => meeting.scheduled === true);
  const scheduled: ScheduledMeeting[] = scheduledMeetings.map((meeting) => {
    const meetingDate = meeting.startDate?.toLocaleDateString();
    const start = meeting.startTime;
    const end = meeting.endTime;
    return {
      name: meeting.name,
      id: meeting.id,
      link: "www.google.com",
      date: meetingDate,
      startTime: start,
      endTime: end,
      attendance: "maybe",
      location: meeting.location,
    } as unknown as ScheduledMeeting;
  });

  const unscheduledMeetings = meetingList.filter((meeting) => meeting.scheduled === false);

  const unscheduled: UnscheduledMeeting[] = unscheduledMeetings.map((meeting) => {
    const startDate = meeting.startDate?.toLocaleDateString();
    const endDate = meeting.endDate?.toLocaleDateString();
    const startTime = meeting.startTime;
    const endTime = meeting.endTime;
    return {
      name: meeting.name,
      id: meeting.id,
      link: "www.google.com",
      startDate,
      endDate,
      startTime,
      endTime,
      attendance: "maybe",
      location: meeting.location,
    } as unknown as UnscheduledMeeting;
  });

  return {
    scheduled,
    unscheduled,
  };
};
