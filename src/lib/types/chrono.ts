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


//Anchor dates represent the 7 days of the week using reference dates
export const ANCHOR_DATES: Date[] = [
    new Date(2023, 0, 1), 
    new Date(2023, 0, 2), 
    new Date(2023, 0, 3),
    new Date(2023, 0, 4), 
    new Date(2023, 0, 5), 
    new Date(2023, 0, 6), 
    new Date(2023, 0, 7), 
];




//Check if a date string matches any anchor date
export function isAnchorDateString(dateString: string): boolean {
    return ANCHOR_DATES.some(anchorDate => (anchorDate.toISOString().split('T')[0]) === dateString);
}

//Gets the index of an anchor date
export function getAnchorDateIndex(dateString: string): number {
    return ANCHOR_DATES.findIndex(anchorDate => (anchorDate.toISOString().split('T')[0]) === dateString);
}
