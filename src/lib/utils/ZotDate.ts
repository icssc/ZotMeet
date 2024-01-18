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
    return this.day.getDay();
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
  determineDayWithinBounds(date1: Date, date2: Date): boolean {
    if (date2 > date1) {
      return this.day >= date1 && this.day <= date2;
    } else {
      return this.day <= date1 && this.day >= date1;
    }
  }

  /**
   * Given a zero-indexed month and year, returns formatted days per week with appropriate padding
   * @param month zero-indexed month of the year
   * @param year number representing the year
   * @param [selectedDays] an array of selected days to render in the calendar
   * @returns a nested array of formatted days per week
   */
  static generateZotDates(month: number, year: number, selectedDays?: ZotDate[]): ZotDate[][] {
    const dayOfWeekOfFirst: number = new Date(year, month).getDay();
    const daysInMonth: number = ZotDate.getDaysInMonth(month, year);

    const generatedZotDates: ZotDate[][] = [];

    let day = 1;

    for (let weekIndex = 0; weekIndex < CalendarConstants.MAX_WEEKS_PER_MONTH; weekIndex++) {
      const generatedWeek: ZotDate[] = [];

      //TODO: May have edge case with new year
      for (let dayIndex = 0; dayIndex < CalendarConstants.MAX_DAYS_PER_WEEK; dayIndex++) {
        if (day > daysInMonth) {
          // Add a padding day if before the first day of month or after the last day of month
          const newDate = new Date(`${month + 1}-${1}-${year}`);
          generatedWeek.push(new ZotDate(newDate, false));
        } else if (weekIndex === 0 && dayIndex < dayOfWeekOfFirst) {
          const prevMonthDay = ZotDate.getDaysInMonth(month - 1, year);
          const newDate = new Date(`${month - 1}-${prevMonthDay}-${year}`);
          generatedWeek.push(new ZotDate(newDate, false));
        } else {
          const newDate = new Date(`${month}-${day}-${year}`);
          const newZotDate = new ZotDate(newDate, false);

          // Check if day is selected
          if (selectedDays && selectedDays.find((d: ZotDate) => d.dateEquals(newZotDate))) {
            newZotDate.isSelected = true;
          }

          generatedWeek.push(newZotDate);
          day++;
        }
      }
      generatedZotDates.push(generatedWeek);
    }

    return generatedZotDates;
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
}
