export class ZotDate {
  availability: boolean[];
  day: Date;
  startTime: Date;
  endTime: Date;
  blockLength: number;

  constructor(
    day: Date,
    startTime: string = "08:00",
    endTime: string = "17:00",
    blockLength: number = 15,
  ) {
    this.day = day;
    this.startTime = new Date(`${this.day}T${startTime}`);
    this.endTime = new Date(`${this.day}T${endTime}`);
    this.blockLength = blockLength;

    const totalLength = Math.round(
      Math.abs(this.endTime.valueOf() - this.startTime.valueOf()) / 60000,
    );
    const totalBlocks = totalLength / this.blockLength;
    this.availability = new Array(totalBlocks).fill(false);
  }

  getBlock(time: string): number {
    const startMS: number = this.startTime.valueOf();
    const curMS: number = new Date(`${this.day}${time}`).valueOf();
    const totalLength = Math.round(Math.abs(curMS - startMS) / 60000);
    return totalLength / this.blockLength;
  }

  getAvailability(time: string): boolean {
    const block = this.getBlock(time);
    return this.availability[block];
  }

  getAvailabilities(): boolean[] {
    return this.availability;
  }

  setAvailabilityFromTime(
    startedTime: string,
    endedTime: string,
    selectedAvailability: boolean,
  ): void {
    const startBlock = this.getBlock(startedTime);
    const endBlock = this.getBlock(endedTime);
    this.availability = this.availability.map((val, idx) =>
      idx >= startBlock && idx <= endBlock ? selectedAvailability : val,
    );
  }
}
