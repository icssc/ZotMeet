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
	selectedDate: ZotDate | null;
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
	currentPageAvailability: (ZotDate | null)[],
): boolean[] => {
	return currentPageAvailability.map((date, index, arr) => {
		if (index === 0) return false;

		const prev = arr[index - 1];
		if (!date || !prev) return false;

		const prevDate = prev.day;
		const currentDate = date.day;

		return (
			differenceInCalendarDays(new Date(currentDate), new Date(prevDate)) > 1
		);
	});
};

export const newZonedPageAvailAndDates = (
	currentPageAvailability: (ZotDate | null)[],
	availabilityDates: ZotDate[] | null,
	doesntNeedDay: boolean,
): [(ZotDate | null)[], ZotDate[]] => {
	const newBlocks: (ZotDate | null)[] = currentPageAvailability.map(
		(date, index) => {
			if (date) {
				return new ZotDate(date);
			}
			return currentPageAvailability[index];
		},
	);

	let dayIndex = currentPageAvailability.length - 1;
	while (currentPageAvailability[dayIndex] == null) {
		dayIndex -= 1;
	}
	let newAvailDates: ZotDate[] = [];
	if (availabilityDates) {
		newAvailDates = availabilityDates.map((date) => new ZotDate(date));
	}

	if (!doesntNeedDay && dayIndex >= 0) {
		const prevDay = currentPageAvailability[dayIndex];
		if (!prevDay) return [newBlocks, newAvailDates];
		const newDay = new Date(prevDay.day);
		newDay.setDate(newDay.getDate() + 1);
		newBlocks[dayIndex + 1] = new ZotDate(
			newDay,
			prevDay.earliestTime,
			prevDay.latestTime,
			false,
			[],
			{},
			prevDay.ianaTimeZone,
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
					prevDay.ianaTimeZone,
				),
			);
		}
	}
	return [newBlocks, newAvailDates];
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

/** ISO string for the start of a 15-minute slot; matches ZotDate / drag-save encoding. */
export function getTimestampFromBlockIndex(
	blockIndex: number,
	zotDateIndex: number,
	fromTimeMinutes: number,
	availabilityDates: ZotDate[],
	timeZone?: string,
): string {
	const totalMinutes = fromTimeMinutes + blockIndex * BLOCK_LENGTH;

	const selectedDate = availabilityDates.at(zotDateIndex);
	if (!selectedDate) return "";

	if (timeZone) {
		const datePart = formatInTimeZone(selectedDate.day, timeZone, "yyyy-MM-dd");
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		const localTime = `${datePart}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
		return fromZonedTime(localTime, timeZone).toISOString();
	}

	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	const date = new Date(selectedDate.day);
	date.setHours(hours, minutes, 0, 0);

	return date.toISOString();
}

/** Same day layout as `deriveInitialAvailability` in use-availability-data, without member data. */
export function buildZotDateRowsForMeetingDays(
	meetingDates: string[],
	availabilityTimeBlocks: number[],
	timeZone?: string,
): ZotDate[] {
	return meetingDates
		.map((meetingDate) => {
			const dateStr = meetingDate.split("T")[0];
			const [year, month, day] = dateStr.split("-").map(Number);
			const date = timeZone
				? fromZonedTime(`${dateStr}T00:00:00`, timeZone)
				: new Date(year, month - 1, day);

			const earliestMinutes = availabilityTimeBlocks[0] ?? 480;
			const latestMinutes =
				(availabilityTimeBlocks[availabilityTimeBlocks.length - 1] ?? 1035) +
				15;

			return new ZotDate(
				date,
				earliestMinutes,
				latestMinutes,
				false,
				[],
				{},
				timeZone,
			);
		})
		.sort((a, b) => a.day.getTime() - b.day.getTime());
}

export function buildMeetingGridIsoSet(
	availabilityDates: ZotDate[],
	fromTimeMinutes: number,
	blockCount: number,
	timeZone?: string,
): Set<string> {
	const set = new Set<string>();
	for (let d = 0; d < availabilityDates.length; d++) {
		for (let b = 0; b < blockCount; b++) {
			const iso = getTimestampFromBlockIndex(
				b,
				d,
				fromTimeMinutes,
				availabilityDates,
				timeZone,
			);
			if (iso) set.add(iso);
		}
	}
	return set;
}

export function filterTimestampsToMeetingGrid(
	timestamps: readonly string[],
	gridIsoSet: ReadonlySet<string>,
): string[] {
	return timestamps.filter((ts) => gridIsoSet.has(ts));
}

export function hasTimestampOnMeetingGrid(
	timestamps: readonly string[] | null | undefined,
	gridIsoSet: ReadonlySet<string>,
): boolean {
	if (!timestamps?.length) return false;
	return timestamps.some((ts) => gridIsoSet.has(ts));
}

function mergeImportedGridSlots(
	availabilityDates: readonly ZotDate[],
	slotIsoStrings: readonly string[],
	memberId: string,
): ZotDate[] {
	const updated = availabilityDates.map((d) => d.clone());
	const unique = new Set(slotIsoStrings);
	const timeZone = updated.find((z) => z.ianaTimeZone)?.ianaTimeZone;
	const calendarDayKey = (d: Date) =>
		timeZone
			? formatInTimeZone(d, timeZone, "yyyy-MM-dd")
			: d.toLocaleDateString("en-CA");

	for (const iso of unique) {
		const slotDay = calendarDayKey(new Date(iso));
		const zot = updated.find((z) => calendarDayKey(z.day) === slotDay);
		if (!zot) continue;

		if (!zot.availability.includes(iso)) {
			zot.availability.push(iso);
			zot.availability.sort();
		}
		const members = zot.groupAvailability[iso] ?? [];
		if (!members.includes(memberId)) {
			zot.groupAvailability[iso] = [...members, memberId];
		}
	}
	return updated;
}

/** Merges imported available + if-needed slots while keeping states mutually exclusive. */
export function mergeImportedPersonalGridSlots({
	availabilityDates,
	ifNeededDates,
	meetingAvailabilities,
	ifNeededAvailabilities,
	memberId,
}: {
	availabilityDates: readonly ZotDate[];
	ifNeededDates: readonly ZotDate[];
	meetingAvailabilities: readonly string[];
	ifNeededAvailabilities: readonly string[];
	memberId: string;
}): { availabilityDates: ZotDate[]; ifNeededDates: ZotDate[] } {
	const mergedAvailabilityDates = mergeImportedGridSlots(
		availabilityDates,
		meetingAvailabilities,
		memberId,
	);
	const mergedIfNeededDates = mergeImportedGridSlots(
		ifNeededDates,
		ifNeededAvailabilities,
		memberId,
	);

	const availableSet = new Set(meetingAvailabilities);
	const ifNeededSet = new Set(ifNeededAvailabilities);

	for (
		let dateIndex = 0;
		dateIndex < mergedAvailabilityDates.length;
		dateIndex++
	) {
		const availableDate = mergedAvailabilityDates[dateIndex];
		const ifNeededDate = mergedIfNeededDates[dateIndex];
		if (!availableDate || !ifNeededDate) continue;

		for (const timestamp of availableSet) {
			if (ifNeededSet.has(timestamp)) continue;
			if (ifNeededDate.availability.includes(timestamp)) {
				ifNeededDate.availability = ifNeededDate.availability.filter(
					(ts) => ts !== timestamp,
				);
			}
			if (ifNeededDate.groupAvailability[timestamp]) {
				ifNeededDate.groupAvailability[timestamp] =
					ifNeededDate.groupAvailability[timestamp].filter(
						(id) => id !== memberId,
					);
			}
		}

		for (const timestamp of ifNeededSet) {
			if (availableSet.has(timestamp)) continue;
			if (availableDate.availability.includes(timestamp)) {
				availableDate.availability = availableDate.availability.filter(
					(ts) => ts !== timestamp,
				);
			}
			if (availableDate.groupAvailability[timestamp]) {
				availableDate.groupAvailability[timestamp] =
					availableDate.groupAvailability[timestamp].filter(
						(id) => id !== memberId,
					);
			}
		}
	}

	return {
		availabilityDates: mergedAvailabilityDates,
		ifNeededDates: mergedIfNeededDates,
	};
}

/** Clears personal available/if-needed slots */
export function clearPersonalGridSlots(
	availabilityDates: readonly ZotDate[],
	ifNeededDates: readonly ZotDate[],
	memberId: string,
): { availabilityDates: ZotDate[]; ifNeededDates: ZotDate[] } {
	const clearDates = (dates: readonly ZotDate[]) =>
		dates.map((date) => {
			const clonedDate = date.clone();
			clonedDate.availability = [];
			clonedDate.groupAvailability = Object.fromEntries(
				Object.entries(clonedDate.groupAvailability).map(
					([timestamp, members]) => [
						timestamp,
						members.filter((id) => id !== memberId),
					],
				),
			);
			return clonedDate;
		});

	return {
		availabilityDates: clearDates(availabilityDates),
		ifNeededDates: clearDates(ifNeededDates),
	};
}
