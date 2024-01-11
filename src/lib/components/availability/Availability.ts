// TODO: Import Day class (cannot currently do because is not pushed onto main yet)

/**
 * Availability
 * -------------
 * selectedDay : the current day for which availability is being represented
 * overallTimes: the start and end time of the able-to-be selected
 * blockLength : the amount of time every block of availability is (default 30 minutes)
 * availableTimes: the available time blocks
 */

export class Availability {
  selectedDay: string; // should be Day or Date
  startTime: string;
  endTime: string;
  blockLength: number;
  totalBlocks: number;
  availableTimes: boolean[];

  constructor(
    selectedDay: string,
    startTime = "08:00",
    endTime = "17:00",
    blockLength: number = 30,
  ) {
    this.selectedDay = selectedDay;
    this.blockLength = blockLength;
    this.startTime = startTime;
    this.endTime = endTime;

    // Converts length from length of time block
    const endMS = new Date(`${selectedDay}T${startTime}`).valueOf();
    console.log(`${selectedDay}T${startTime}`);
    const startMS = new Date(`${selectedDay}T${endTime}`).valueOf();
    const totalLength = Math.round(Math.abs(endMS - startMS) / 60000);

    this.totalBlocks = totalLength / blockLength;
    this.availableTimes = new Array(this.totalBlocks).fill(false);
  }

  getBlock(time: string): number {
    const startMS = new Date(`${this.selectedDay}T${this.startTime}`).valueOf();
    const timeMS = new Date(`${this.selectedDay}T${time}`).valueOf();
    const currentLength = Math.round(Math.abs(timeMS - startMS) / 60000);
    return currentLength / this.blockLength;
  }

  getAvailability(time: string): boolean {
    const block = this.getBlock(time);
    return this.availableTimes[block];
  }

  getAvailabilities(): boolean[] {
    return this.availableTimes;
  }

  setAvailabilityFromTime(started: string, ended: string, newAvailability: boolean): void {
    const startBlock = this.getBlock(started);
    const endBlock = this.getBlock(ended);
    this.availableTimes = this.availableTimes.map((val, idx) =>
      idx >= startBlock && idx <= endBlock ? newAvailability : val,
    );
  }
}
