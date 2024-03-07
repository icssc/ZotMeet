import { readable, writable } from "svelte/store";

import type { MemberAvailability } from "./../types/availability";

import { TimeConstants } from "$lib/types/chrono";
import { ZotDate } from "$lib/utils/ZotDate";

export const BLOCK_LENGTH: number = 15;
export const getTimeFromHoursAndMinutes = (hours: number, minutes: number = 0): number => {
  return hours * TimeConstants.MINUTES_PER_HOUR + minutes;
};
export const getTimeFromString = (timeString: string): number => {
  const [hourString, minuteString] = timeString.split(":");
  const hours = parseInt(hourString, 10);
  const minutes = parseInt(minuteString, 10);
  return getTimeFromHoursAndMinutes(hours, minutes);
};

const earliestTime: number = getTimeFromHoursAndMinutes(8);
const latestTime: number = getTimeFromHoursAndMinutes(17, 30);

const sampleMembers: MemberAvailability[] = [
  {
    name: "Sean Fong",
    availableBlocks: [[1], [2], [3, 4, 5], [], [], [], []],
  },
  {
    name: "Joe Biden",
    availableBlocks: [[], [1, 2], [4, 5, 6], [], [], [], []],
  },
];

const generateSampleDates = (
  startTime: number,
  endTime: number,
  groupMembers: MemberAvailability[],
): ZotDate[] => {
  // Placeholder date array from Calendar component
  const selectedCalendarDates: ZotDate[] = [
    new ZotDate(new Date(2024, 1, 1)),
    new ZotDate(new Date(2024, 1, 2)),
    new ZotDate(new Date(2024, 1, 3)),
    new ZotDate(new Date(2024, 1, 4)),
    new ZotDate(new Date(2024, 1, 5)),
    new ZotDate(new Date(2024, 1, 6)),
    new ZotDate(new Date(2024, 1, 7)),
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
export const groupMembers = readable<MemberAvailability[]>(sampleMembers);
