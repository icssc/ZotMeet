export class ZotDate {
  availability: boolean[];
  day: Date;
  startTime: Date;
  endTime: Date;

  constructor(availability: boolean[], day: Date, startTime: Date, endTime: Date) {
    this.availability = availability;
    this.day = day;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}
