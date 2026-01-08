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

// Anchor dates represent the 7 days of the week using reference dates
export const ANCHOR_DATES: Date[] = [
	new Date(Date.UTC(2023, 0, 1)),
	new Date(Date.UTC(2023, 0, 2)),
	new Date(Date.UTC(2023, 0, 3)),
	new Date(Date.UTC(2023, 0, 4)),
	new Date(Date.UTC(2023, 0, 5)),
	new Date(Date.UTC(2023, 0, 6)),
	new Date(Date.UTC(2023, 0, 7)),
];

// Check if a date string matches any anchor date
export function isAnchorDateString(dateString: string): boolean {
	return ANCHOR_DATES.some(
		(anchorDate) => anchorDate.toISOString().split("T")[0] === dateString,
	);
}

// Check if it is a meeting with an anchor date by using the first date
export function isAnchorDateMeeting(dates: string[]): boolean {
    if (dates.length === 0) return false;
    const firstDateStr = dates[0].split("T")[0];
    return isAnchorDateString(firstDateStr);
}

export function getCurrentWeekDateForAnchor(anchorDate: Date): Date {
    const dayOfWeek = anchorDate.getUTCDay(); // Sun is 0 and Sat is 6
    const now = new Date();
    const currentDayOfWeek = now.getDay();

    const diff = dayOfWeek - currentDayOfWeek;
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);

    // Reset time to match the anchor date's time (midnight)
    targetDate.setHours(0, 0, 0, 0);

    return targetDate;
}

export function convertAnchorDatesToCurrentWeek(
    anchorDateStrings: string[]
): string[] {
    return anchorDateStrings.map((dateStr) => {
        const anchorDate = new Date(dateStr);
        const currentWeekDate = getCurrentWeekDateForAnchor(anchorDate);
        return currentWeekDate.toISOString();
    });
}
