import type { CalendarDay } from "$lib/components/Calendar/Calendar";

enum CalendarConstants {
  MaxWeeksPerMonth = 6,
  MaxDaysPerWeek = 7,
}

/**
 * Given a zero-indexed month and year, returns formatted days per week with appropriate padding
 * @param month zero-indexed month of the year
 * @param year number representing the year
 * @returns a nested array of formatted days per week
 */
export const generateCalendarDays = (month: number, year: number): CalendarDay[][] => {
  const dayOfWeekOfFirst: number = new Date(year, month).getDay();
  const daysInMonth: number = getDaysInMonth(month, year);

  const generatedCalendarDays: CalendarDay[][] = [];

  let dayNumber = 1;

  for (let w = 0; w < CalendarConstants.MaxWeeksPerMonth; w++) {
    const generatedWeek: CalendarDay[] = [];

    for (let d = 0; d < CalendarConstants.MaxDaysPerWeek; d++) {
      if (dayNumber > daysInMonth || (w === 0 && d < dayOfWeekOfFirst)) {
        generatedWeek.push({
          day: -1,
          month: month,
          year: year,
          isSelected: false,
        });
      } else {
        generatedWeek.push({
          day: dayNumber,
          month: month,
          year: year,
          isSelected: false,
        });
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
    return { day: day, month: month, year: year, isSelected: isSelected };
  }

  return null;
};
