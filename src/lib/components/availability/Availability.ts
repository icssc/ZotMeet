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
  availableTimes: boolean[];

  constructor(
    selectedDay: string,
    startTime = "08:00:00",
    endTime = "17:00:00",
    blockLength: number = 30,
  ) {
    this.selectedDay = selectedDay;
    this.blockLength = blockLength;
    this.startTime = startTime;
    this.endTime = endTime;

    // Converts length from length of time block
    const endMS = new Date(`${selectedDay}T${startTime}`).valueOf();
    const startMS = new Date(`${selectedDay}T${endTime}`).valueOf();
    const totalLength = Math.round(Math.abs(endMS - startMS) / 60000);
    const totalBlocks = totalLength / blockLength;

    this.availableTimes = new Array(totalBlocks).fill(false);
  }
}
