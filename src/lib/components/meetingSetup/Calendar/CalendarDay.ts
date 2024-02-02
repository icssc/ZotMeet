enum CalendarConstants {
  MAX_WEEKS_PER_MONTH = 6,
  MAX_DAYS_PER_WEEK = 7,
}

export class Day {
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

  equals(otherDay: Day): boolean {
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
   * Given two dates, determines whether the date falls within range of those dates
   * @param date1 a date representing a boundary of the date range
   * @param date2 a date representing a boundary of the date range
   * @returns a boolean of whether the date is selected within the start and end dates
   */
  determineDayWithinBounds = (date1: Day, date2: Day): boolean => {
    if (date1 > date2) {
      return date2 <= this && this <= date1;
    } else {
      return date1 <= this && this <= date2;
    }
  };

  /**
   * Given a zero-indexed month and year, returns formatted days per week with appropriate padding
   * @param month zero-indexed month of the year
   * @param year number representing the year
   * @param [selectedDays] an array of selected days to render in the calendar
   * @returns a nested array of formatted days per week
   */
  static generateCalendarDays = (month: number, year: number, selectedDays?: Day[]): Day[][] => {
    const dayOfWeekOfFirst: number = new Date(year, month).getDay();
    const daysInMonth: number = getDaysInMonth(month, year);

    const generatedCalendarDays: Day[][] = [];

    let day = 1;

    for (let weekIndex = 0; weekIndex < CalendarConstants.MAX_WEEKS_PER_MONTH; weekIndex++) {
      const generatedWeek: Day[] = [];

      for (let dayIndex = 0; dayIndex < CalendarConstants.MAX_DAYS_PER_WEEK; dayIndex++) {
        if (day > daysInMonth || (weekIndex === 0 && dayIndex < dayOfWeekOfFirst)) {
          // Add a padding day if before the first day of month or after the last day of month
          generatedWeek.push(new Day(-1, month, year, false));
        } else {
          const newCalendarDay = new Day(day, month, year, false);

          // Check if day is selected
          if (selectedDays && selectedDays.find((d) => d.equals(newCalendarDay))) {
            newCalendarDay.isSelected = true;
          }

          generatedWeek.push(newCalendarDay);
          day++;
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
  static extractDayFromElement = (element: Element): Day | null => {
    const day = parseInt(element.getAttribute("data-day") ?? "");
    const month = parseInt(element.getAttribute("data-month") ?? "");
    const year = parseInt(element.getAttribute("data-year") ?? "");
    const isSelected = element.getAttribute("data-selected") === "true" ? true : false;

    if ([day, month, year, isSelected].every((attr) => !Number.isNaN(attr) && attr !== null)) {
      return new Day(day, month, year, isSelected);
    }

    return null;
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
