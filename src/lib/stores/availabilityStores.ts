import { writable, readable } from "svelte/store";

import { TimeConstants } from "$lib/types/chrono";
import { ZotDate } from "$lib/utils/ZotDate";

const BLOCK_LENGTH: number = 15;
const earliestTime: number = TimeConstants.MINUTES_PER_HOUR * 9;
const latestTime: number = TimeConstants.MINUTES_PER_HOUR * 17.5;

const generateSampleDates = (): ZotDate[] => {
  // Placeholder date array from Calendar component
  const selectedCalendarDates: ZotDate[] = [
    new ZotDate(new Date("1 1 2024")),
    new ZotDate(new Date("1 2 2024")),
    new ZotDate(new Date("1 3 2024")),
    new ZotDate(new Date("1 4 2024")),
    new ZotDate(new Date("1 5 2024")),
    new ZotDate(new Date("1 6 2024")),
    new ZotDate(new Date("1 7 2024")),
  ];

  ZotDate.initializeAvailabilities(selectedCalendarDates, earliestTime, latestTime, BLOCK_LENGTH);

  return selectedCalendarDates;
};

const generateTimeBlocks = (): number[] => {
  const timeBlocks: number[] = [];

  const minuteRange = Math.abs(latestTime - earliestTime);
  const totalBlocks = Math.floor(minuteRange / BLOCK_LENGTH);

  for (let blockIndex = 0; blockIndex < totalBlocks; blockIndex++) {
    timeBlocks.push(earliestTime + blockIndex * BLOCK_LENGTH);
  }
  return timeBlocks;
};

export const availabilityDates = writable<ZotDate[]>(generateSampleDates());
export const availabilityTimeBlocks = readable<number[]>(generateTimeBlocks());
