enum CalendarConstants {
  MAX_WEEKS_PER_MONTH = 6,
  MAX_DAYS_PER_WEEK = 7,
}

export const DAYS_OF_WEEK: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export class CalendarDay {
  day: number;
  month: number;
  year: number;
  isSelected: boolean;

  constructor(day: number, month: number, year: number, isSelected: boolean = false) {
    this.day = day;
    this.month = month;
    this.year = year;
    this.isSelected = isSelected;
  }

  equals(otherDay: CalendarDay): boolean {
    return (
      this.day === otherDay.day && this.month === otherDay.month && this.year === otherDay.year
    );
  }

  toString() {
    return `[${this.year}/${this.month}/${this.day}] [${
      this.isSelected ? "SELECTED" : "NOT SELECTED"
    }]`;
  }

  /**
   * Used for comparing dates with < and >
   */
  valueOf() {
    return this.day + this.month * 31 + this.year * 366;
  }

  /**
   * Given a zero-indexed month and year, returns formatted days per week with appropriate padding
   * @param month zero-indexed month of the year
   * @param year number representing the year
   * @param [selectedDays] an array of selected days to render in the calendar
   * @returns a nested array of formatted days per week
   */
  static generateCalendarDays = (
    month: number,
    year: number,
    selectedDays?: CalendarDay[],
  ): CalendarDay[][] => {
    const dayOfWeekOfFirst: number = new Date(year, month).getDay();
    const daysInMonth: number = getDaysInMonth(month, year);

    const generatedCalendarDays: CalendarDay[][] = [];

    let dayNumber = 1;

    for (let w = 0; w < CalendarConstants.MAX_WEEKS_PER_MONTH; w++) {
      const generatedWeek: CalendarDay[] = [];

      for (let d = 0; d < CalendarConstants.MAX_DAYS_PER_WEEK; d++) {
        if (dayNumber > daysInMonth || (w === 0 && d < dayOfWeekOfFirst)) {
          generatedWeek.push(new CalendarDay(-1, month, year, false));
        } else {
          const newCalendarDay = new CalendarDay(dayNumber, month, year, false);

          // Check if day is selected
          if (selectedDays && selectedDays.find((d) => d.equals(newCalendarDay))) {
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
   * Extracts data attributes from a DOM element in the calendar that represents a day
   * @param element a DOM element in the calendar that represents a day
   * @returns a CalendarDay object that is represented by the DOM element
   */
  static extractDayFromElement = (element: Element): CalendarDay | null => {
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
  static updateDayRange = (
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
        (d) => d.isSelected && d.equals(new CalendarDay(iDay, iMonth, iYear)),
      );

      if (startIsSelected && foundSelectedDay) {
        // Remove selected day
        newSelectedDays = newSelectedDays.filter((d) => !d.equals(foundSelectedDay));
      } else if (!foundSelectedDay) {
        // Add day to selected days
        newSelectedDays.push(new CalendarDay(iDay, iMonth, iYear, true));
      }

      ++iDay;
    }
    return newSelectedDays;
  };
}

/**
 * Given a zero-indexed month and year, returns the number of days in the month and year
 * @param month zero-indexed month of the year
 * @param year number representing the year
 * @returns the amount of days in the given month and year
 */
const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};
