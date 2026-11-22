import { formatInTimeZone } from "date-fns-tz";
import type { TimeWindow } from "./match";

/** "2h", "1h 30m", "45m". */
export function formatMinutes(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	if (hours === 0) return `${rest}m`;
	return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

/** "1:00–3:00 PM", or "11:30 AM–1:00 PM" across noon, in `timeZone`. */
export function formatWindow(window: TimeWindow, timeZone: string): string {
	const startMeridiem = formatInTimeZone(window.start, timeZone, "a");
	const endMeridiem = formatInTimeZone(window.end, timeZone, "a");
	const end = formatInTimeZone(window.end, timeZone, "h:mm a");
	const start = formatInTimeZone(
		window.start,
		timeZone,
		startMeridiem === endMeridiem ? "h:mm" : "h:mm a",
	);
	return `${start}–${end}`;
}

/** "Tue. 10/13, 1:00pm-3:00pm": a time card's title. */
export function formatShortDayAndWindow(
	window: TimeWindow,
	timeZone: string,
): string {
	const day = formatInTimeZone(window.start, timeZone, "EEE. M/d");
	const start = formatInTimeZone(window.start, timeZone, "h:mmaaa");
	const end = formatInTimeZone(window.end, timeZone, "h:mmaaa");
	return `${day}, ${start}-${end}`;
}

/** "1:00 PM". */
export function formatClock(ms: number, timeZone: string): string {
	return formatInTimeZone(ms, timeZone, "h:mm a");
}
