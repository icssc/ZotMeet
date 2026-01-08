import { differenceInCalendarDays } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { type HourMinuteString, TimeConstants } from "@/lib/types/chrono";
import type { ZotDate } from "@/lib/zotdate";

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

	// Convert to the target timezone
	const zonedDate = toZonedTime(utcDate, timezone);

	// Format as HH:MM:SS in the target timezone
	const localHours = zonedDate.getHours().toString().padStart(2, "0");
	const localMinutes = zonedDate.getMinutes().toString().padStart(2, "0");
	const localSeconds = zonedDate.getSeconds().toString().padStart(2, "0");

	return `${localHours}:${localMinutes}:${localSeconds}`;
};

export const BLOCK_LENGTH: number = 15;

export const generateTimeBlocks = (
	startTime: number,
	endTime: number,
): number[] => {
	const timeBlocks: number[] = [];
	const minuteRange = Math.abs(endTime - startTime);
	const totalBlocks = Math.floor(minuteRange / BLOCK_LENGTH);

	for (let blockIndex = 0; blockIndex < totalBlocks; blockIndex++) {
		timeBlocks.push(startTime + blockIndex * BLOCK_LENGTH);
	}
	return timeBlocks;
};

export const generateDateKey = ({
	selectedDate,
	timeBlock,
	pageDateIndex,
}: {
	selectedDate: ZotDate;
	timeBlock: number;
	pageDateIndex: number;
}) => {
	return selectedDate
		? `date-${selectedDate.valueOf()}-${timeBlock}-${pageDateIndex}`
		: `padding-${pageDateIndex}-${timeBlock}`;
};

export const getMinutesFromMidnight = (isoOrDateString: string): number => {
	const date = new Date(isoOrDateString);
	return date.getHours() * 60 + date.getMinutes();
};

export const getDatePart = (isoOrDateString: string): string => {
	return isoOrDateString.substring(0, 10);
};

export function generateCellKey(
	zotDateIndex: number,
	blockIndex: number,
): string {
	return `${zotDateIndex}_${blockIndex}`;
}

export const spacerBeforeDate = (
	currentPageAvailability: ZotDate[],
): boolean[] => {
	return currentPageAvailability.map((date, index, arr) => {
		if (index === 0) return false;

		if (!date || !arr[index - 1]) return false;

		const prevDate = arr[index - 1].day;
		const currentDate = date.day;

		return (
			differenceInCalendarDays(new Date(currentDate), new Date(prevDate)) > 1
		);
	});
};
