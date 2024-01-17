export class ZotDate {
  availability: boolean[];
  day: Date;
  startTime: Date;
  endTime: Date;
  blockLength: number;

  constructor(
    day: Date = new Date(),
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

    // Converts the difference in time from endTime to startTime into minutes
    const totalLength = Math.round(
      Math.abs(this.endTime.valueOf() - this.startTime.valueOf()) / 60000,
    );
    const totalBlocks = totalLength / this.blockLength;
    this.availability = new Array(totalBlocks).fill(false);
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
  setAvailabilityFromTime(
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
}
