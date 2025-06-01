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

export const ANCHOR_DATES: string[] = [
    "2023-01-01",
    "2023-01-02",
    "2023-01-03",
    "2023-01-04",
    "2023-01-05",
    "2023-01-06",
    "2023-01-07",
];
