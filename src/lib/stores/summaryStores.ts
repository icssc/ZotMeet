import { writable } from "svelte/store";

import type { Group, ScheduledMeeting, UnscheduledMeeting } from "$lib/types/meetings";

const dummyGroups: Group[] = [
  {
    name: "AntAlmanac",
    id: 1,
    img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
    link: "https://google.com",
  },
  {
    name: "Group Two",
    id: 2,
    img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
    link: "https://google.com",
  },
  {
    name: "Group Three",
    id: 3,
    img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
    link: "https://google.com",
  },
  {
    name: "Group Three",
    id: 4,
    img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
    link: "https://google.com",
  },
  {
    name: "Group Three",
    id: 5,
    img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
    link: "https://google.com",
  },
  {
    name: "Group Three",
    id: 6,
    img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
    link: "https://google.com",
  },
];

const dummyScheduledMeetings: ScheduledMeeting[] = [
  {
    name: "AntAlmanac",
    id: 1,
    link: "https://google.com",
    date: "2024-12-31",
    startTime: "11:00",
    endTime: "13:30",
    attending: "Yes",
    location: "CSL 8",
  },
  {
    name: "Meeting Two",
    id: 2,
    link: "https://google.com",
    date: "2024-3-08",
    startTime: "8:00",
    endTime: "15:00",
    attending: "No",
    location: "CSL 8",
  },
  {
    name: "Meeting Three",
    id: 3,
    link: "https://google.com",
    date: "2024-3-09",
    startTime: "8:00",
    endTime: "15:00",
    attending: "Yes",
    location: "CSL 8",
  },
  {
    name: "Meeting Four",
    id: 4,
    link: "https://google.com",
    date: "2024-3-10",
    startTime: "8:00",
    endTime: "15:00",
    attending: "Maybe",
    location: "CSL 8",
  },
];

const dummyUnscheduledMeetings: UnscheduledMeeting[] = [
  {
    name: "Unscheduled ZotMeet",
    id: 1,
    link: "https://google.com",
    startDate: "2023-12-03",
    endDate: "2023-12-09",
    startTime: "11:00",
    endTime: "13:30",
    location: "CSL 8",
  },
  {
    name: "Meeting Dos",
    id: 2,
    link: "https://google.com",
    startDate: "2023-12-03",
    endDate: "2023-12-09",
    startTime: "8:00",
    endTime: "15:00",
    location: "CSL 8",
  },
  {
    name: "Meeting Tres",
    id: 3,
    link: "https://google.com",
    startDate: "2023-12-08",
    endDate: "2023-12-20",
    startTime: "8:00",
    endTime: "15:00",
    location: "CSL 8",
  },
  {
    name: "Meeting Quatro",
    id: 4,
    link: "https://google.com",
    startDate: "2023-12-08",
    endDate: "2023-12-19",
    startTime: "8:00",
    endTime: "15:00",
    location: "CSL 8",
  },
];

export const groups = writable<Group[]>(dummyGroups);
export const scheduledMeetings = writable<ScheduledMeeting[]>(dummyScheduledMeetings);
export const unscheduledMeetings = writable<UnscheduledMeeting[]>(dummyUnscheduledMeetings);
