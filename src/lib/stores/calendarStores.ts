import { writable } from "svelte/store";

import { CalendarDay } from "$lib/components/Calendar/CalendarDay";

export const selectedDays = writable<CalendarDay[]>([]);

/**
 * Updates a range of dates based on a user selection
 * @param startDate the beginning day, such that it occurs before endDatre
 * @param endDate the ending day, such that it occurs after startDate
 */
export const updatedSelectedRange = (startDate: CalendarDay, endDate: CalendarDay): void => {
  if (startDate > endDate) {
    throw "Bounds for date range are in the incorrect order.";
  } else if (startDate.month !== endDate.month || startDate.year != endDate.year) {
    throw "The selected range must be in the same month.";
  }

  selectedDays.update((alreadySelectedDays: CalendarDay[]) => {
    let modifiedSelectedDays = [...alreadySelectedDays];

    let iDay = startDate.day;
    const iMonth = startDate.month;
    const iYear = startDate.year;

    while (iDay <= endDate.day) {
      const foundSelectedDay = alreadySelectedDays.find(
        (d) => d.isSelected && d.equals(new CalendarDay(iDay, iMonth, iYear)),
      );

      if (startDate.isSelected && foundSelectedDay) {
        // Remove selected day
        modifiedSelectedDays = modifiedSelectedDays.filter((d) => !d.equals(foundSelectedDay));
      } else if (!foundSelectedDay) {
        // Add day to selected days
        modifiedSelectedDays.push(new CalendarDay(iDay, iMonth, iYear, true));
      }

      iDay++;
    }

    return modifiedSelectedDays;
  });
};
