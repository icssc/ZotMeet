export enum Weekday {
    Sunday = "Sun",
    Monday = "Mon",
    Tuesday = "Tue",
    Wednesday = "Wed",
    Thursday = "Thu",
    Friday = "Fri",
    Saturday = "Sat",
}

export const WEEKDAYS = Object.values(Weekday);

export enum Months {
    January = "January",
    February = "February",
    March = "March",
    April = "April",
    May = "May",
    June = "June",
    July = "July",
    August = "August",
    September = "September",
    October = "October",
    November = "November",
    December = "December",
}

export const MONTHS = Object.values(Months);

export enum CalendarConstants {
    MAX_WEEKS_PER_MONTH = 6,
    MAX_DAYS_PER_WEEK = 7,
}

export enum TimeConstants {
    MINUTES_PER_HOUR = 60,
}

export type HourMinuteString = `${string}:${string}:${string}`;
