import { writable } from "svelte/store";

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
export const availabilityDates = writable<ZotDate[]>(generateSampleDates());
export const availabilityTimeBlocks = writable<number[]>(defaultTimeBlocks);
