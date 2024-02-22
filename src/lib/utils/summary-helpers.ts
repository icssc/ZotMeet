import { WEEKDAYS } from "$lib/types/chrono";
import type { Meeting, ScheduledMeeting, UnscheduledMeeting } from "$lib/types/meetings";

export function convertIsoToDate(isoDateString: string): string {
  const date = new Date(isoDateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function getWeekdayFromIso(isoDateString: string): string {
  const date = new Date(isoDateString);
  return WEEKDAYS[date.getDay()];
}

export function convertTo12HourFormat(time: string): string {
  const [hours, minutes] = time.split(":");
  let period = "am";

  let hours12 = parseInt(hours, 10);

  if (hours12 >= 12) {
    period = "pm";
    if (hours12 > 12) {
      hours12 -= 12;
    }
  }

  return `${hours12}:${minutes} ${period}`;
}

export function groupAndSortScheduledMeetings(scheduledMeetings: ScheduledMeeting[]) {
  const groupedMeetings = scheduledMeetings.reduce(
    (groups: Record<string, ScheduledMeeting[]>, meeting) => {
      const date = meeting.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(meeting);
      return groups;
    },
    {},
  );

  for (const date in groupedMeetings) {
    groupedMeetings[date] = sortScheduledMeetingsByDateAndTime(groupedMeetings[date]);
  }

  return groupedMeetings;
}

export function sortScheduledMeetingsByDateAndTime(scheduledMeetings: ScheduledMeeting[]) {
  return scheduledMeetings.sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date);

    if (dateComparison === 0) {
      return sortMeetingsByTime(a, b);
    }

    return dateComparison;
  });
}

export function sortUnscheduledMeetingsByDateAndTime(unscheduledMeetings: UnscheduledMeeting[]) {
  return unscheduledMeetings.sort((a, b) => {
    const startDateComparison = a.startDate.localeCompare(b.startDate);

    if (startDateComparison === 0) {
      const endDateComparison = a.endDate.localeCompare(b.endDate);

      if (endDateComparison === 0) {
        return sortMeetingsByTime(a, b);
      }
      return endDateComparison;
    }
    return startDateComparison;
  });
}

function sortMeetingsByTime(meetingA: Meeting, meetingB: Meeting) {
  const startTimeA = meetingA.startTime.split(":");
  const startTimeB = meetingB.startTime.split(":");
  const startTimeComparison = Number(startTimeA[0]) - Number(startTimeB[0]);

  if (startTimeComparison === 0) {
    const endTimeA = meetingA.endTime.split(":");
    const endTimeB = meetingB.endTime.split(":");
    return Number(endTimeA[0]) - Number(endTimeB[0]) || Number(endTimeA[1]) - Number(endTimeB[1]);
  }
  return startTimeComparison;
}
