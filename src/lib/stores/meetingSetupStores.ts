import { writable } from "svelte/store";

import { Day } from "$lib/components/Calendar/CalendarDay";

export const selectedDays = writable<Day[]>([]);

/**
 * Updates a range of dates based on a user selection
 * @param startDate the day that the user first initiated the date multiselect range
 * @param endDate the day that the user ended the date multiselect range
 */
export const updateSelectedRange = (startDate: Day, endDate: Day): void => {
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

  selectedDays.update((alreadySelectedDays: Day[]) => {
    let modifiedSelectedDays = [...alreadySelectedDays];

    const month = lowerBound.month;
    const year = lowerBound.year;

    for (let day = lowerBound.day; day <= upperBound.day; day++) {
      const foundSelectedDay = alreadySelectedDays.find(
        (d) => d.isSelected && d.equals(new Day(day, month, year)),
      );

      if (startDate.isSelected && foundSelectedDay) {
        // Remove any selected days if the multiselect initiated from an already selected day
        modifiedSelectedDays = modifiedSelectedDays.filter((d) => !d.equals(foundSelectedDay));
      } else if (!startDate.isSelected && !foundSelectedDay) {
        // Add day to selected days if the multiselect did not initiate from an already selected day
        modifiedSelectedDays.push(new Day(day, month, year, true));
      }
    }

    return modifiedSelectedDays;
  });
};
