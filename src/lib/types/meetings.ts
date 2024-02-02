export type Group = { name: string; id: number; img: string; link: string };

export type Meeting = ScheduledMeeting | UnscheduledMeeting;

export type ScheduledMeeting = {
  name: string;
  id: number;
  link: string;
  date: string;
  startTime: string;
  endTime: string;
  attending: string;
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
};

export type MeetingTime = {
  startTime: string;
  endTime: string;
};
