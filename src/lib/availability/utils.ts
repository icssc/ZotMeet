import { differenceInCalendarDays } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { type HourMinuteString, TimeConstants } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";

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

export const BLOCK_LENGTH: number = 15;

export const generateTimeBlocks = (
	startTime: number,
	endTime: number,
): number[] => {
	const timeBlocks: number[] = [];
	var range = endTime - startTime;
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

export const newZonedPageAvailAndDates = (
	currentPageAvailability: ZotDate[],
	availabilityDates: ZotDate[] | null,
	doesntNeedDay: boolean,
): [ZotDate[], ZotDate[]] => {
	const newBlocks = currentPageAvailability.map((date, index) => {
		if (date) {
			return new ZotDate(date);
		} else {
			return currentPageAvailability[index];
		}
	});

	let dayIndex = currentPageAvailability.length - 1;
	while (currentPageAvailability[dayIndex] == null) {
		dayIndex -= 1;
	}
	let newAvailDates: ZotDate[] = [];
	if (availabilityDates) {
		newAvailDates = availabilityDates.map((date) => new ZotDate(date));
	}

	if (!doesntNeedDay) {
		const prevDay = currentPageAvailability[dayIndex];
		const newDay = new Date(prevDay.day);
		newDay.setDate(newDay.getDate() + 1);
		newBlocks[dayIndex + 1] = new ZotDate(
			newDay,
			prevDay.earliestTime,
			prevDay.latestTime,
			false,
			[],
			{},
		);
		if (availabilityDates) {
			newAvailDates.push(
				new ZotDate(
					newDay,
					prevDay.earliestTime,
					prevDay.latestTime,
					false,
					[],
					{},
				),
			);
		}
	}
	return [newBlocks, newAvailDates];
};
