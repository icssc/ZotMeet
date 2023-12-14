import { CalendarDay } from "$lib/components/Calendar/CalendarDay";

enum CalendarConstants {
  MaxWeeksPerMonth = 6,
  MaxDaysPerWeek = 7,
}

/**
 * Given a zero-indexed month and year, returns formatted days per week with appropriate padding
 * @param month zero-indexed month of the year
 * @param year number representing the year
 * @param [selectedDays] an array of selected days to render in the calendar
 * @returns a nested array of formatted days per week
 */
export const generateCalendarDays = (
  month: number,
  year: number,
  selectedDays?: CalendarDay[],
): CalendarDay[][] => {
  const dayOfWeekOfFirst: number = new Date(year, month).getDay();
  const daysInMonth: number = getDaysInMonth(month, year);

  const generatedCalendarDays: CalendarDay[][] = [];

  let dayNumber = 1;

  for (let w = 0; w < CalendarConstants.MaxWeeksPerMonth; w++) {
    const generatedWeek: CalendarDay[] = [];

    for (let d = 0; d < CalendarConstants.MaxDaysPerWeek; d++) {
      if (dayNumber > daysInMonth || (w === 0 && d < dayOfWeekOfFirst)) {
        generatedWeek.push(new CalendarDay(-1, month, year, false));
      } else {
        const newCalendarDay = new CalendarDay(dayNumber, month, year, false);

        // Check if day is selected
        if (selectedDays && selectedDays.find((d) => d.equalsDay(newCalendarDay))) {
          newCalendarDay.isSelected = true;
        }

        generatedWeek.push(newCalendarDay);
        dayNumber++;
      }
    }
    generatedCalendarDays.push(generatedWeek);
  }

  return generatedCalendarDays;
};

/**
 * Given a zero-indexed month and year, returns the number of days in the month and year
 * @param month zero-indexed month of the year
 * @param year number representing the year
 * @returns the amount of days in the given month and year
 */
export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Extracts data attributes from a DOM element in the calendar that represents a day
 * @param element a DOM element in the calendar that represents a day
 * @returns a CalendarDay object that is represented by the DOM element
 */
export const extractDayFromElement = (element: Element): CalendarDay | null => {
  const day = parseInt(element.getAttribute("data-day") ?? "");
  const month = parseInt(element.getAttribute("data-month") ?? "");
  const year = parseInt(element.getAttribute("data-year") ?? "");
  const isSelected = element.getAttribute("data-selected") === "true" ? true : false;

  if ([day, month, year, isSelected].every((attr) => !Number.isNaN(attr) && attr !== null)) {
    return new CalendarDay(day, month, year, isSelected);
  }

  return null;
};

/**
 * Updates a range of dates based on a user selection
 * @param d1 the beginning day, such that d1 occurs before d2
 * @param d2 the ending day, such that d2 occurs after d1
 * @param selectedDays representing the user's selected days
 * @param startIsSelected whether the starting day was already selected
 * @returns an updated representation of the user's selected days
 */
export const updateDayRange = (
  d1: CalendarDay,
  d2: CalendarDay,
  selectedDays: CalendarDay[],
  startIsSelected: boolean,
): CalendarDay[] => {
  let newSelectedDays = [...selectedDays];

  if (d1 > d2) {
    throw "Bounds for date range are in the incorrect order.";
  } else if (d1.month !== d2.month || d1.year != d2.year) {
    throw "The selected range must be in the same month.";
  }

  let iDay = d1.day;
  const iMonth = d1.month;
  const iYear = d1.year;

  while (iDay <= d2.day) {
    const foundSelectedDay = selectedDays.find(
      (d) => d.isSelected && d.equalsDayFromValues(iDay, iMonth, iYear),
    );

    if (startIsSelected && foundSelectedDay) {
      // Remove selected day
      newSelectedDays = newSelectedDays.filter((d) => !d.equalsDay(foundSelectedDay));
    } else if (!foundSelectedDay) {
      // Add day to selected days
      newSelectedDays.push(new CalendarDay(iDay, iMonth, iYear, true));
    }

    ++iDay;
  }
  return newSelectedDays;
};
