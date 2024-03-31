import { writable } from "svelte/store";

import type { MeetingTime } from "$lib/types/meetings";
import { ZotDate } from "$lib/utils/ZotDate";

export const selectedDays = writable<ZotDate[]>([]);

/**
 * Updates a range of dates based on a user selection
 * @param startDate the day that the user first initiated the date multiselect range
 * @param endDate the day that the user ended the date multiselect range
 */
export const updateSelectedRange = (startDate: ZotDate, endDate: ZotDate): void => {
  const highlightedRange: Date[] = ZotDate.generateRange(startDate.day, endDate.day);

  selectedDays.update((alreadySelectedDays: ZotDate[]) => {
    let modifiedSelectedDays = [...alreadySelectedDays];

    highlightedRange.forEach((highlightedZotDate: Date) => {
      const foundSelectedDay = alreadySelectedDays.find(
        (d) => d.compareTo(new ZotDate(highlightedZotDate)) === 0,
      );

      if (startDate.isSelected && foundSelectedDay) {
        // Remove any selected days if the multiselect initiated from an already selected day
        modifiedSelectedDays = modifiedSelectedDays.filter(
          (d) => d.compareTo(foundSelectedDay) !== 0,
        );
      } else if (!startDate.isSelected && !foundSelectedDay) {
        // Add day to selected days if the multiselect did not initiate from an already selected day
        modifiedSelectedDays.push(new ZotDate(highlightedZotDate, true));
      }
    });

    return modifiedSelectedDays;
  });
};

export const DEFAULT_MEETING_NAME = "";
export const meetingName = writable<string>(DEFAULT_MEETING_NAME);

export const DEFAULT_MEETING_TIMES: MeetingTime = {
  startTime: "08:00",
  endTime: "17:00",
};

export const startTime = writable<string>(DEFAULT_MEETING_TIMES.startTime);
export const endTime = writable<string>(DEFAULT_MEETING_TIMES.endTime);
