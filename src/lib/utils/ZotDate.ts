import { CalendarConstants } from "$lib/types/chrono";

export class ZotDate {
  availability: boolean[];
  day: Date;
  startTime: Date;
  endTime: Date;
  blockLength: number;
  isSelected: boolean;

  constructor(
    day: Date = new Date(),
    isSelected: boolean = false,
    startTime: string | Date = "08:00",
    endTime: string | Date = "17:00",
    blockLength: number = 15,
  ) {
    this.day = day;

    // TypeScript does not provide multiple constructor support, so this is my implementation
    if (startTime instanceof Date) {
      this.startTime = startTime;
    } else {
      this.startTime = new Date(`${this.day}T${startTime}`);
    }

    if (endTime instanceof Date) {
      this.endTime = endTime;
    } else {
      this.endTime = new Date(`${this.day}T${endTime}`);
    }

    this.blockLength = blockLength;
    this.isSelected = isSelected;

    // Converts the difference in time from endTime to startTime into minutes
    const totalLength = Math.round(
      Math.abs(this.endTime.valueOf() - this.startTime.valueOf()) / 60000,
    );
    const totalBlocks = totalLength / this.blockLength;
    this.availability = new Array(totalBlocks).fill(false);
  }

  /**
   * Getter for Day attribute of day
   * @return The day value of the current day
   */
  getDay(): number {
    return this.day.getDate();
  }

  /** Getter for Month attribute of day
   * @return The month value of the current day
   */
  getMonth(): number {
    return this.day.getMonth();
  }

  /** Getter for Year attribute of the current day
   * @return The year value of the current day
   */
  getYear(): number {
    return this.day.getFullYear();
  }

  /**
   * Used for comparing dates with < and >
   */
  valueOf() {
    return this.day.getDate() + this.day.getMonth() * 31 + this.day.getFullYear() * 366;
  }

  /**
   * Gets the Block in the array of availability based on provided time
   * @param time represented as a string or Date object
   * @return the current block number (within the array) of the time
   */
  getBlock(time: string | Date): number {
    let curMS: number;

    if (time instanceof Date) {
      curMS = time.valueOf();
    } else {
      curMS = new Date(`${this.day}${time}`).valueOf();
    }

    const startMS: number = this.startTime.valueOf();
    const totalLength = Math.round(Math.abs(curMS - startMS) / 60000);
    return totalLength / this.blockLength;
  }

  /**
   * Gets the current availability based on the provided time
   * @param time represented as a string or Date object
   * @return the current availability of the block corresponding to the given time
   */
  getAvailability(time: string | Date): boolean {
    const block = this.getBlock(time);
    return this.availability[block];
  }

  /**
   * Returns all availabilities
   * @return a list of availabilities for every time block
   */
  getAvailabilities(): boolean[] {
    return this.availability;
  }

  /**
   * Marks availability from the first selected to final selected time
   * If currently available, becomes unavailable and vice versa
   * @param startedTime string or Date object representing first time selected
   * @param endedTime string or Date object representing final time selected
   * @param selectedAvailability the current state of the first selected block of overall selection
   */
  setAvailabilities(
    startedTime: string | Date,
    endedTime: string | Date,
    selectedAvailability: boolean,
  ): void {
    const startBlock = this.getBlock(startedTime);
    const endBlock = this.getBlock(endedTime);
    this.availability = this.availability.map((val, idx) =>
      idx >= startBlock && idx <= endBlock ? !selectedAvailability : val,
    );
  }

  dateEquals(otherDate: ZotDate): boolean {
    return (
      this.getDay() === otherDate.getDay() &&
      this.getMonth() === otherDate.getMonth() &&
      otherDate.getYear() === otherDate.getYear()
    );
  }

  /**
   * Given two dates, determines whether the date falls within range of those dates
   * @param date1 a date representing a boundary of the date range
   * @param date2 a date representing a boundary of the date range
   * @returns a boolean of whether the date is selected within the start and end dates
   */
  determineDayWithinBounds(date1: ZotDate, date2: ZotDate): boolean {
    if (date1 > date2) {
      return date2 <= this && this <= date1;
    } else {
      return date1 <= this && this <= date2;
    }
  }

  /**
   * Given a zero-indexed month and year, returns formatted days per week with appropriate padding
   * @param month zero-indexed month of the year
   * @param year number representing the year
   * @param [selectedDays] an array of selected days to render in the calendar
   * @returns a nested array of formatted days per week
   */
  static generateCalendarDays(month: number, year: number, selectedDays?: ZotDate[]): ZotDate[][] {
    const dayOfWeekOfFirst: number = new Date(year, month).getDay();
    const daysInMonth: number = ZotDate.getDaysInMonth(month, year);

    const generatedCalendarDays: ZotDate[][] = [];

    let day = 1;
    let nextMonthDay = 1;

    for (let weekIndex = 0; weekIndex < CalendarConstants.MAX_WEEKS_PER_MONTH; weekIndex++) {
      const generatedWeek: ZotDate[] = [];

      for (let dayIndex = 0; dayIndex < CalendarConstants.MAX_DAYS_PER_WEEK; dayIndex++) {
        let newDate: Date;
        let isSelected: boolean = false;

        if (weekIndex === 0 && dayIndex < dayOfWeekOfFirst) {
          newDate = this.getPreviousMonthPadding(month, year, dayOfWeekOfFirst, dayIndex);
        } else if (day > daysInMonth) {
          newDate = this.getNextMonthPadding(month, year, nextMonthDay);
          nextMonthDay++;
        } else {
          newDate = new Date(`${month + 1}-${day}-${year}`);

          // Check if day is selected
          if (
            selectedDays &&
            selectedDays.find((d: ZotDate) => d.dateEquals(new ZotDate(newDate)))
          ) {
            isSelected = true;
          }

          day++;
        }
        const newZotDate = new ZotDate(newDate, isSelected);
        generatedWeek.push(newZotDate);
      }
      generatedCalendarDays.push(generatedWeek);
    }

    return generatedCalendarDays;
  }

  /**
   * Extracts data attributes from a DOM element in the calendar that represents a day
   * @param element a DOM element in the calendar that represents a day
   * @returns a ZotDate object that is represented by the DOM element
   */
  static extractDayFromElement(element: Element): ZotDate | null {
    const day = parseInt(element.getAttribute("data-day") ?? "");
    const month = parseInt(element.getAttribute("data-month") ?? "");
    const year = parseInt(element.getAttribute("data-year") ?? "");
    const isSelected = element.getAttribute("data-selected") === "true";

    if ([day, month, year, isSelected].every((attr) => !Number.isNaN(attr) && attr !== null)) {
      const newDay = new Date(`${month}-${day}-${year}`);
      return new ZotDate(newDay, isSelected);
    }

    return null;
  }

  /**
   * Given a zero-indexed month and year, returns the number of days in the month and year
   * @param month zero-indexed month of the year
   * @param year number representing the year
   * @returns the amount of days in the given month and year
   */
  static getDaysInMonth(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  static getPreviousMonthPadding(
    month: number,
    year: number,
    dayOfWeekOfFirst: number,
    dayIndex: number,
  ): Date {
    let previousMonth = month - 1;
    let yearOfPreviousMonth = year;

    // Calculate month before January as December of last year
    if (previousMonth < 0) {
      previousMonth += 12;
      yearOfPreviousMonth = year - 1;
    }

    const daysInPreviousMonth = ZotDate.getDaysInMonth(previousMonth, yearOfPreviousMonth);
    const dayWithOffset = daysInPreviousMonth - dayOfWeekOfFirst + dayIndex + 1;

    // Add 1 to previous month for 1-indexed month in Date constructor
    return new Date(`${previousMonth + 1}-${dayWithOffset}-${yearOfPreviousMonth}`);
  }

  static getNextMonthPadding(month: number, year: number, nextMonthDay: number): Date {
    let nextMonth = month + 1;
    let yearOfNextMonth = year;

    // Calculate month after December as January of next year
    if (nextMonth == 12) {
      nextMonth = 0;
      yearOfNextMonth = year + 1;
    }

    // Add 1 to next month for 1-indexed month in Date constructor
    return new Date(`${nextMonth + 1}-${nextMonthDay}-${yearOfNextMonth}`);
  }
}
