import { writable } from "svelte/store";

import { CalendarDay } from "$lib/components/Calendar/CalendarDay";

export const selectedDays = writable<CalendarDay[]>([]);

/**
 * Updates a range of dates based on a user selection
 * @param startDate the day that the user first initiated the date multiselect range
 * @param endDate the day that the user ended the date multiselect range
 */
export const updatedSelectedRange = (startDate: CalendarDay, endDate: CalendarDay): void => {
  if (startDate.month !== endDate.month || startDate.year != endDate.year) {
    throw "The selected range must be in the same month.";
  }

  let lowerBound = startDate;
  let upperBound = endDate;

  // If the user selects backwards, swap the selections such that the date of lowerBound is before upperBound
  if (startDate > endDate) {
    lowerBound = endDate;
    upperBound = startDate;
  }

  selectedDays.update((alreadySelectedDays: CalendarDay[]) => {
    let modifiedSelectedDays = [...alreadySelectedDays];

    let iDay = lowerBound.day;
    const iMonth = lowerBound.month;
    const iYear = lowerBound.year;

    while (iDay <= upperBound.day) {
      const foundSelectedDay = alreadySelectedDays.find(
        (d) => d.isSelected && d.equals(new CalendarDay(iDay, iMonth, iYear)),
      );

      if (startDate.isSelected && foundSelectedDay) {
        // Remove any selected days if the multiselect initiated from an already selected day
        modifiedSelectedDays = modifiedSelectedDays.filter((d) => !d.equals(foundSelectedDay));
      } else if (!startDate.isSelected && !foundSelectedDay) {
        // Add day to selected days if the multiselect did not initiate from an already selected day
        modifiedSelectedDays.push(new CalendarDay(iDay, iMonth, iYear, true));
      }

      iDay++;
    }

    return modifiedSelectedDays;
  });
};