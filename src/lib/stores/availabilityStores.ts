import { writable } from "svelte/store";

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

export const generateSampleDates = (
  startTime: number = earliestTime,
  endTime: number = latestTime,
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
export const availabilityDates = writable<ZotDate[]>(generateSampleDates(earliestTime, latestTime));
export const availabilityTimeBlocks = writable<number[]>(defaultTimeBlocks);
export const groupAvailabilities = writable<MemberAvailability[]>([]);

export const isEditingAvailability = writable<boolean>(false);
export const isStateUnsaved = writable<boolean>(false);

export const guestSession = writable<GuestSession>({
  guestName: "",
  meetingId: "",
});
