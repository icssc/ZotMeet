import { CalendarConstants } from "@/lib/types/chrono";

export class ZotDate {
    readonly day: Date;
    isSelected: boolean;
    availability: boolean[];
    groupAvailability: (number[] | null)[];
    blockLength: number;

    // Times represented as minutes past midnight
    earliestTime: number;
    latestTime: number;

    /**
     * Description
     * @param day a Date object representing a calendar day
     * @param isSelected whether the day is selected from the calendar
     */
    constructor(
        day: Date = new Date(),
        isSelected: boolean = false,
        availability: boolean[] = []
    ) {
        this.day = day;
        this.isSelected = isSelected;
        this.blockLength = 15;
        this.earliestTime = 0;
        this.latestTime = 0;
        this.availability = availability;
        this.groupAvailability = [];
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
     * @return a number proportional to the amount of days elapsed since 0 AD, although not exact due to leap years
     */
    valueOf(): number {
        return this.day.getTime();
    }


    /**
     * Determines whether the current ZotDate occurs before or after another ZotDate
     * @param otherDate another ZotDate to compare to
     * @returns a number, -1 indicating the date occurs before, 1 indicating the date occurs after, and 0 indicating the dates are the same
     */
    compareTo(otherDate: ZotDate): number {
        if (this < otherDate) {
            return -1;
        } else if (this > otherDate) {
            return 1;
        }
        return 0;
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
     * Given two Date bojects, generates a consecutive range of dates as an array of Date objects, regardless of their chronological order
     * @param date1 a date representing a boundary of the date range
     * @param date2 a date representing a boundary of the date range
     * @returns an array of Dates representing the range of dates
     */
    static generateRange(date1: Date, date2: Date): Date[] {
        if (date1 === date2) {
            return [date1];
        }

        let earlierDate = date1;
        let laterDate = date2;

        if (date1 > date2) {
            earlierDate = date2;
            laterDate = date1;
        }

        const generatedRange: Date[] = [];

        const maxRangeIterations =
            CalendarConstants.MAX_DAYS_PER_WEEK *
            CalendarConstants.MAX_WEEKS_PER_MONTH;

        const currentDate = earlierDate;

        while (currentDate <= laterDate) {
            if (generatedRange.length > maxRangeIterations) {
                throw new Error(
                    `Maximum iterations for date selection range exceeded (${maxRangeIterations})`
                );
            }

            generatedRange.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return generatedRange;
    }

    /**
     * Given a zero-indexed month and a year, returns formatted days per week with appropriate padding
     * @param month zero-indexed month of the year
     * @param year number representing the year
     * @param [selectedDays] an array of selected days to render in the calendar
     * @returns a nested array of formatted days per week
     */
    static generateZotDates(
        month: number,
        year: number,
        selectedDays?: ZotDate[]
    ): ZotDate[][] {
        const dayOfWeekOfFirst: number = new Date(year, month).getDay();
        const daysInMonth: number = ZotDate.getDaysInMonth(month, year);

        const generatedZotDates: ZotDate[][] = [];

        let day = 1;
        let nextMonthDay = 1;

        for (
            let weekIndex = 0;
            weekIndex < CalendarConstants.MAX_WEEKS_PER_MONTH;
            weekIndex++
        ) {
            const generatedWeek: ZotDate[] = [];

            for (
                let dayIndex = 0;
                dayIndex < CalendarConstants.MAX_DAYS_PER_WEEK;
                dayIndex++
            ) {
                let newDate: Date;
                let isSelected: boolean = false;

                if (weekIndex === 0 && dayIndex < dayOfWeekOfFirst) {
                    newDate = ZotDate.calculatePreviousMonthDate(
                        month,
                        year,
                        dayOfWeekOfFirst,
                        dayIndex
                    );
                } else if (day > daysInMonth) {
                    newDate = ZotDate.calculateNextMonthDate(
                        month,
                        year,
                        nextMonthDay
                    );
                    nextMonthDay++;
                } else {
                    newDate = new Date(year, month, day);

                    day++;
                }

                // Check if day is selected
                if (
                    selectedDays &&
                    selectedDays.find(
                        (d: ZotDate) => d.compareTo(new ZotDate(newDate)) === 0
                    )
                ) {
                    isSelected = true;
                }

                const newZotDate = new ZotDate(newDate, isSelected);
                generatedWeek.push(newZotDate);
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

        if (
            [day, month, year, isSelected].every(
                (attr) => !Number.isNaN(attr) && attr !== null
            )
        ) {
            const newDay = new Date(year, month, day);
            return new ZotDate(newDay, isSelected);
        }

        return null;
    }

    /**
     * Calculates a Date object from the previous month, given a current month, year, and day offsets
     *
     * e.g. To generate the first week of January 2025, we need to find the last days the previous month
     *    - Calculates the previous month as December 2024.
     *      [12/??/24 , 12/??/24 , 12/??/24 , 1/1/25 , 1/2/25 , 1/3/25 , 1/4/25]
     *    - dayOfWeekOfFirst = 3 since 1/1/25 is at index 3.
     *    - dayIndex = 0 gives 12/29/24, 1 gives 12/30/24, and 2 gives 12/31/24, ...
     *
     * @param month 0-indexed month
     * @param year current year
     * @param dayOfWeekOfFirst day of the week of the current month
     * @param dayIndex offset number of days to add to the previous month
     * @returns a Date object from the previous month with appropriate day offset
     */
    static calculatePreviousMonthDate(
        month: number,
        year: number,
        dayOfWeekOfFirst: number,
        dayIndex: number
    ): Date {
        let previousMonth = month - 1;
        let yearOfPreviousMonth = year;

        // Calculate month before January as December of last year
        if (previousMonth < 0) {
            previousMonth += 12;
            yearOfPreviousMonth = year - 1;
        }

        const daysInPreviousMonth = ZotDate.getDaysInMonth(
            previousMonth,
            yearOfPreviousMonth
        );
        const dayWithOffset =
            daysInPreviousMonth - dayOfWeekOfFirst + dayIndex + 1;

        return new Date(yearOfPreviousMonth, previousMonth, dayWithOffset);
    }

    /**
     * Calculates a Date object for the next month, given a current month, year, and day
     *
     * e.g. When we finish generating 12/31/2024, we need to find the first days of the next month.
     *    - Calculates the next month to be January 2024.
     *      [12/29/24 , 12/30/24 , 12/31/24 , 1/??/24, 1/??/24, 1/??/24 , 1/??/24]
     *    - nextMonthDay = 1 gives 1/1/25, 2 gives 1/2/25, ...
     *
     * @param month 0-indexed month
     * @param year current year
     * @param nextMonthDay the day for the next month
     * @returns a Date object from the next month with appropriate day offset
     */
    static calculateNextMonthDate(
        month: number,
        year: number,
        nextMonthDay: number
    ): Date {
        let nextMonth = month + 1;
        let yearOfNextMonth = year;

        // Calculate month after December as January of next year
        if (nextMonth == 12) {
            nextMonth = 0;
            yearOfNextMonth = year + 1;
        }

        return new Date(yearOfNextMonth, nextMonth, nextMonthDay);
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

    /**
     * Returns a formatted time string given the number of minutes past midnight
     * @param minutesFromMidnight number of minutes from midnight
     * @returns a "HH:MM AM|PM" formatted string
     */
    static toTimeBlockString(
        minutesFromMidnight: number,
        abbreviated: boolean
    ): string {
        let isAM = true;

        let hour = Math.floor(minutesFromMidnight / 60);

        if (hour === 0) {
            hour = 12;
        } else if (hour >= 12) {
            isAM = false;

            if (hour > 12) {
                hour %= 12;
            }
        }

        const formattedMinutes = (minutesFromMidnight % 60)
            .toString()
            .padStart(2, "0");

        return `${hour}${abbreviated ? "" : ":" + formattedMinutes} ${isAM ? "AM" : "PM"}`;
    }

    /**
     * Initializes availability range from the first selected to final selected time of an array of ZotDates
     * @param selectedDates array of ZotDates to initialize availability
     * @param earliestTime minutes since midnight that marks the earliest boundary of possible meeting times
     * @param latestTime minutes since midnight that marks the latest boundary of possible meeting times
     * @param blockLength optional minutes per availability block, default is 15
     * @return an array of numbers, each representing minutes from the earliest time
     */
    static initializeAvailabilities(
        selectedDates: ZotDate[],
        earliestTime: number = 480,
        latestTime: number = 1050,
        blockLength: number = 15
    ): void {
        const minuteRange = Math.abs(latestTime - earliestTime);
        const totalBlocks = Math.floor(minuteRange / blockLength);

        selectedDates.forEach((selectedDate: ZotDate) => {
            selectedDate.earliestTime = earliestTime;
            selectedDate.latestTime = latestTime;
            selectedDate.blockLength = blockLength;
            selectedDate.availability = new Array<boolean>(totalBlocks).fill(
                false
            );
            selectedDate.groupAvailability = new Array<null>(totalBlocks).fill(
                null
            );
        });
    }

    /**
     * Gets the current availability based on the block index
     * @param index index of the availability block
     * @return the current availability of the block corresponding to the given index
     */
    getBlockAvailability(index: number): boolean {
        return this.availability[index];
    }

    /**
     * Updates a range of availabilities in the availability array
     * @param earlierBlockIndex the 0-indexed starting index of the availability array
     * @param laterBlockIndex the inclusive ending index of the availability array
     * @param selection a boolean value to set for each availability in the range
     */
    setBlockAvailabilities(
        earlierBlockIndex: number,
        laterBlockIndex: number,
        selection: boolean
    ): void {
        for (
            let blockIndex = earlierBlockIndex;
            blockIndex <= laterBlockIndex;
            blockIndex++
        ) {
            this.availability[blockIndex] = selection;
        }
    }

    /**
     * Sets whether the day is selected or not
     * @param isSelected a boolean representing whether the day is selected
     */
    setSelected(isSelected: boolean) {
        this.isSelected = isSelected;
    }

    /**
     * Updates the ZotDate's group member availability array
     *
     * e.g. A group member array: `['Sean', 'Collan', 'Joe']`
     *
     *   `setGroupMemberAvailability(1, [3, 4, 5])` will update availability time blocks 3 - 5
     *   to indicate Collan is available.
     *   - if Sean was already available on block 3, block 3 will be changed from `[0]` to `[0, 1]`.
     *   - if nobody was already available on block 4, block 4 will be changed from `null` to `[1]`.
     *
     * Because this.groupAvailability is by default a null array to save memory, an array will be
     * instantiated if it is the first member to indicate availability of that block.
     *
     * @param memberIndex the index of a member in an array
     * @param availableBlocks an array of availability blocks to set that member's availability
     */
    setGroupMemberAvailability(
        memberIndex: number,
        availableBlocks: number[]
    ): void {
        availableBlocks.forEach((blockIndex) => {
            if (!this.groupAvailability[blockIndex]) {
                this.groupAvailability[blockIndex] = [memberIndex];
            } else {
                this.groupAvailability[blockIndex]?.push(memberIndex);
            }
        });
    }

    /**
     * Gets the group availability block based on the block index
     * @param index index of the availability block
     * @return the current availability of the block corresponding to the given index
     */
    getGroupAvailabilityBlock(index: number): number[] | null {
        return this.groupAvailability[index];
    }
}
