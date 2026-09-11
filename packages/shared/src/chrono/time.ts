import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { type HourMinuteString, TimeConstants } from "./types";

/**
 * Pure time helpers shared by the web app and the Expo app. Nothing here may
 * depend on `ZotDate`, the DOM, or anything server-side — the grid logic that
 * does stays in the web app's `src/lib/availability/utils.ts`, which
 * re-exports these so its importers did not have to change.
 *
 * Storage convention: a meeting's `fromTime` / `toTime` are "HH:MM:SS" UTC
 * wall-clock strings, and its `timezone` records which IANA zone they were
 * entered in. Writers go through `convertTimeToUTC`; readers come back through
 * `convertTimeFromUTC`, both anchored on the meeting's first date so DST is
 * resolved consistently.
 */

export const getTimeFromHourMinuteString = (
	hourMinuteString: HourMinuteString,
): number => {
	const [hours, minutes, _seconds] = hourMinuteString.split(":");
	return Number(hours) * TimeConstants.MINUTES_PER_HOUR + Number(minutes);
};

/**
 * Converts a time string from a specific timezone to UTC
 * @param timeString - Time string in format "HH:MM:SS" or "HH:MM"
 * @param timezone - IANA timezone string (e.g., "America/Los_Angeles")
 * @param referenceDate - A date string to use as reference (e.g., "2025-11-13T00:00:00.000Z")
 * @returns Time string in UTC format "HH:MM:SS"
 */
export const convertTimeToUTC = (
	timeString: string,
	timezone: string,
	referenceDate: string,
): string => {
	// Parse the time string
	const [hours, minutes, seconds = "00"] = timeString.split(":");

	// Get just the date part (YYYY-MM-DD) from the ISO string
	const datePart = referenceDate.substring(0, 10);

	// Create a date string in the local timezone
	const localDateTimeString = `${datePart}T${hours}:${minutes}:${seconds}`;

	// Convert from the specified timezone to UTC
	const utcDate = fromZonedTime(localDateTimeString, timezone);

	// Format as HH:MM:SS in UTC
	const utcHours = utcDate.getUTCHours().toString().padStart(2, "0");
	const utcMinutes = utcDate.getUTCMinutes().toString().padStart(2, "0");
	const utcSeconds = utcDate.getUTCSeconds().toString().padStart(2, "0");

	return `${utcHours}:${utcMinutes}:${utcSeconds}`;
};

/**
 * Converts a UTC time string to a specific timezone
 * @param utcTimeString - Time string in UTC format "HH:MM:SS" or "HH:MM"
 * @param timezone - IANA timezone string (e.g., "America/Los_Angeles")
 * @param referenceDate - A date string to use as reference (e.g., "2025-11-13T00:00:00.000Z")
 * @returns Time string in the target timezone format "HH:MM:SS"
 */
export const convertTimeFromUTC = (
	utcTimeString: string,
	timezone: string,
	referenceDate: string,
): string => {
	// Parse the UTC time string
	const [hours, minutes, seconds = "00"] = utcTimeString.split(":");

	// Get just the date part (YYYY-MM-DD) from the ISO string
	const datePart = referenceDate.substring(0, 10);

	// Create a UTC date
	const utcDate = new Date(`${datePart}T${hours}:${minutes}:${seconds}Z`);

	return formatInTimeZone(utcDate, timezone, "HH:mm:ss");
};

/** Meeting `dates` must be chronological for display and time conversion; selection order may differ. */
export function sortMeetingIsoDatesAsc(dates: readonly string[]): string[] {
	return [...dates].sort(
		(a, b) => new Date(a).getTime() - new Date(b).getTime(),
	);
}

/**
 * Local midnight of the calendar day named by an ISO string, ignoring its
 * time and offset. This is how the availability grid keys its day columns:
 * an anchor date like "2023-01-01T00:00:00.000Z" must render as a Sunday in
 * every timezone, which `new Date(iso)` would not guarantee west of UTC.
 */
export function localMidnightFromIsoDate(isoDate: string): Date {
	const [year, month, day] = isoDate.substring(0, 10).split("-").map(Number);
	return new Date(year, month - 1, day);
}

export const BLOCK_LENGTH: number = 15;

export const generateTimeBlocks = (
	startTime: number,
	endTime: number,
): number[] => {
	const timeBlocks: number[] = [];
	let range = endTime - startTime;
	if (endTime < startTime) {
		range = endTime + 1440 - startTime;
	}
	const minuteRange = Math.abs(range);
	const totalBlocks = Math.floor(minuteRange / BLOCK_LENGTH);

	const newTime = [];
	for (let blockIndex = 0; blockIndex < totalBlocks; blockIndex++) {
		if (startTime + blockIndex * BLOCK_LENGTH >= 1440) {
			newTime.push(startTime + blockIndex * BLOCK_LENGTH);
		} else {
			timeBlocks.push(startTime + blockIndex * BLOCK_LENGTH);
		}
	}
	return [...newTime, ...timeBlocks];
};

export const getMinutesFromMidnight = (isoOrDateString: string): number => {
	const date = new Date(isoOrDateString);
	return date.getHours() * 60 + date.getMinutes();
};

export const getDatePart = (isoOrDateString: string): string => {
	return isoOrDateString.substring(0, 10);
};

export const formatTimeWithHoursAndMins = (time: string): string => {
	const [hourStr] = time.split(":");
	let hour = parseInt(hourStr, 10);
	const minutes = parseInt(time.split(":")[1], 10);
	const ampm = hour >= 12 ? "PM" : "AM";
	hour = hour % 12 || 12;
	if (minutes === 0) {
		return `${hour} ${ampm}`;
	}
	return `${hour}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

export const formatDateToUSNumeric = (date: Date) =>
	date.toLocaleDateString("en-US", {
		month: "numeric",
		day: "numeric",
	});

export function formatScheduledTimeRange(timestamps: string[]): string {
	if (timestamps.length === 0) return "";
	const sorted = [...timestamps].sort();
	const start = new Date(sorted[0]);
	const last = new Date(sorted[sorted.length - 1]);
	last.setMinutes(last.getMinutes() + 15);

	const fmt = (d: Date) => {
		const h = d.getHours();
		const m = d.getMinutes();
		const ampm = h >= 12 ? "PM" : "AM";
		const hour = h % 12 || 12;
		return m === 0
			? `${hour}${ampm}`
			: `${hour}:${String(m).padStart(2, "0")}${ampm}`;
	};
	return `${fmt(start)} - ${fmt(last)}`;
}
