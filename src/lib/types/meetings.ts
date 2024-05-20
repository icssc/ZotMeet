import type { HourMinuteString } from "./chrono";

export type Group = { name: string; id: number; img: string; link: string };

export type Meeting = ScheduledMeeting | UnscheduledMeeting;

export type Attendance = "accepted" | "maybe" | "declined" | undefined;

export type ScheduledMeeting = {
  name: string;
  id: number;
  link: string;
  date: string;
  startTime: string;
  endTime: string;
  attendance: Attendance;
  location: string;
};

export type UnscheduledMeeting = {
  name: string;
  id: number;
  link: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  hasIndicated: boolean;
};

export type MeetingTime = {
  startTime: HourMinuteString;
  endTime: HourMinuteString;
};

export interface CreateMeetingPostParams {
  title: string;
  description: string;
  fromTime: HourMinuteString;
  toTime: HourMinuteString;
  meetingDates: string[]; // ISO date strings
  sessionId?: string;
}
