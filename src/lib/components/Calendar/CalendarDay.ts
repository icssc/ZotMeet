export class CalendarDay {
  day: number;
  month: number;
  year: number;
  isSelected: boolean;

  constructor(day: number, month: number, year: number, isSelected: boolean) {
    this.day = day;
    this.month = month;
    this.year = year;
    this.isSelected = isSelected;
  }

  equalsDay(otherDay: CalendarDay): boolean {
    return (
      this.day === otherDay.day && this.month === otherDay.month && this.year === otherDay.year
    );
  }

  equalsDayFromValues(day: number, month: number, year: number): boolean {
    return this.day === day && this.month === month && this.year === year;
  }

  toString() {
    return `[${this.month}/${this.day}/${this.year}] [${this.isSelected}]`;
  }

  // Used for comparing dates with < and >
  valueOf() {
    return this.day + this.month * 31 + this.year * 366;
  }
}
