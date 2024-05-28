import { readable, writable } from "svelte/store";

import type { GuestSession, MemberAvailability } from "./../types/availability";

import { startTime, endTime } from "$lib/stores/meetingSetupStores";
import { TimeConstants, type HourMinuteString } from "$lib/types/chrono";
import { ZotDate } from "$lib/utils/ZotDate";

export const BLOCK_LENGTH: number = 15;

export const getTimeFromHourMinuteString = (hourMinuteString: HourMinuteString): number => {
  const [hours, minutes] = hourMinuteString.split(":");

  return Number(hours) * TimeConstants.MINUTES_PER_HOUR + Number(minutes);
};

let earliestTime: number = getTimeFromHourMinuteString("08:00");
let latestTime: number = getTimeFromHourMinuteString("17:30");

startTime.subscribe((value) => {
  earliestTime = getTimeFromHourMinuteString(value ?? "08:00");
});

endTime.subscribe((value) => {
  latestTime = getTimeFromHourMinuteString(value ?? "17:30");
});

const sampleMembers: MemberAvailability[] = [
  {
    name: "Sean Fong",
    availableBlocks: [[1], [2], [3, 4, 5], [], [], [], []],
  },
  {
    name: "Joe Biden",
    availableBlocks: [[], [1, 2], [4, 5, 6, 22, 23, 24, 25, 26, 27, 28], [], [], [], []],
  },
  {
    name: "Chuck Norris",
    availableBlocks: [
      [4, 5, 6, 7, 8, 9, 10, 11, 20, 21, 22, 23, 24],
      [3, 4, 5, 6, 7],
      [4, 5, 6],
      [],
      [],
      [],
      [],
    ],
  },
  {
    name: "Dwayne the Rock",
    availableBlocks: [[], [1, 2, 3, 4, 5], [4, 5, 6, 25, 26, 27, 28], [], [], [], []],
  },
  {
    name: "Kevin Hart",
    availableBlocks: [[], [1, 2], [26, 27, 28, 29, 30, 31], [], [], [], []],
  },
];

export const generateSampleDates = (
  startTime: number = earliestTime,
  endTime: number = latestTime,
  groupMembers: MemberAvailability[] = sampleMembers,
): ZotDate[] => {
  // Placeholder date array from Calendar component
  const selectedCalendarDates: ZotDate[] = [
    new ZotDate(new Date(2024, 0, 30)),
    new ZotDate(new Date(2024, 0, 31)),
    new ZotDate(new Date(2024, 1, 1)),
    new ZotDate(new Date(2024, 1, 2)),
    new ZotDate(new Date(2024, 1, 3)),
    new ZotDate(new Date(2024, 1, 4)),
    new ZotDate(new Date(2024, 1, 5)),
  ];

  ZotDate.initializeAvailabilities(selectedCalendarDates, startTime, endTime, BLOCK_LENGTH);

  groupMembers.forEach(({ availableBlocks }, memberIndex) => {
    availableBlocks.forEach((availableBlocks, dateIndex) => {
      selectedCalendarDates[dateIndex].setGroupMemberAvailability(memberIndex, availableBlocks);
    });
  });

  return selectedCalendarDates;
};

export const generateTimeBlocks = (startTime: number, endTime: number): number[] => {
  const timeBlocks: number[] = [];
  const minuteRange = Math.abs(endTime - startTime);
  const totalBlocks = Math.floor(minuteRange / BLOCK_LENGTH);

  for (let blockIndex = 0; blockIndex < totalBlocks; blockIndex++) {
    timeBlocks.push(startTime + blockIndex * BLOCK_LENGTH);
  }
  return timeBlocks;
};

const defaultTimeBlocks = generateTimeBlocks(earliestTime, latestTime);
export const availabilityDates = writable<ZotDate[]>(
  generateSampleDates(earliestTime, latestTime, sampleMembers),
);
export const availabilityTimeBlocks = writable<number[]>(defaultTimeBlocks);
export const groupAvailabilities = readable<MemberAvailability[]>(sampleMembers);

export const isEditingAvailability = writable<boolean>(false);
export const isStateUnsaved = writable<boolean>(false);

export const guestSession = writable<GuestSession>({
  guestName: "awaw",
  meetingId: "",
});
