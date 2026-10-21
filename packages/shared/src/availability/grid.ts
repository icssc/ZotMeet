import { differenceInCalendarDays } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { BLOCK_LENGTH } from "../chrono/time";
import type { ZotDate } from "./zotdate";

/**
 * Coordinate helpers for the availability grid. A cell is addressed by
 * `(zotDateIndex, blockIndex)`: which meeting day, and which 15-minute row.
 */

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

export function generateCellKey(
	zotDateIndex: number,
	blockIndex: number,
): string {
	return `${zotDateIndex}_${blockIndex}`;
}

/** Which rule a row draws above itself, and whether it closes the column. */
export interface RowChrome {
	isTopOfHour: boolean;
	isHalfHour: boolean;
	isLastRow: boolean;
}

export function getRowChrome(
	timeBlock: number,
	blockIndex: number,
	blockCount: number,
): RowChrome {
	const minutesInDay = timeBlock % 1440;
	return {
		isTopOfHour: minutesInDay % 60 === 0,
		isHalfHour: minutesInDay % 60 === 30,
		isLastRow: blockIndex === blockCount - 1,
	};
}

/** `true` at each column that follows a gap of more than one calendar day. */
export const spacerBeforeDate = (
	currentPageAvailability: (ZotDate | null)[],
): boolean[] => {
	return currentPageAvailability.map((date, index, arr) => {
		if (index === 0) return false;

		const prev = arr[index - 1];
		if (!date || !prev) return false;

		return differenceInCalendarDays(date.day, prev.day) > 1;
	});
};

/**
 * The one encoding of a grid slot: the instant at `totalMinutes` past midnight
 * on `day`, read in `timeZone` (or the process zone when absent). Both
 * `ZotDate#getISOStringForBlock` and `getTimestampFromBlockIndex` come here,
 * so saved availability and rendered cells can never disagree.
 */
export function isoStringForSlot(
	day: Date,
	totalMinutes: number,
	timeZone?: string,
): string {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	if (timeZone) {
		const datePart = formatInTimeZone(day, timeZone, "yyyy-MM-dd");
		const pad = (n: number) => n.toString().padStart(2, "0");
		const localDateTime = `${datePart}T${pad(hours)}:${pad(minutes)}:00`;
		return fromZonedTime(localDateTime, timeZone).toISOString();
	}
	const date = new Date(day);
	date.setHours(hours, minutes, 0, 0);
	return date.toISOString();
}

/** ISO string for the start of a 15-minute slot; matches ZotDate / drag-save encoding. */
export function getTimestampFromBlockIndex(
	blockIndex: number,
	zotDateIndex: number,
	fromTimeMinutes: number,
	availabilityDates: readonly ZotDate[],
	timeZone?: string,
): string {
	const selectedDate = availabilityDates.at(zotDateIndex);
	if (!selectedDate) return "";
	return isoStringForSlot(
		selectedDate.day,
		fromTimeMinutes + blockIndex * BLOCK_LENGTH,
		timeZone,
	);
}

/** Every slot on the grid, for filtering imported timestamps down to the meeting. */
export function buildMeetingGridIsoSet(
	availabilityDates: readonly ZotDate[],
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

/** `(dateIndex, blockIndex)` → ISO for every cell, so row renders do no date math. */
export function buildTimestampsByCell(
	availabilityDates: readonly ZotDate[],
	blockCount: number,
	fromTimeMinutes: number,
	timeZone?: string,
): Map<string, string> {
	const map = new Map<string, string>();
	for (let d = 0; d < availabilityDates.length; d++) {
		for (let b = 0; b < blockCount; b++) {
			map.set(
				generateCellKey(d, b),
				getTimestampFromBlockIndex(
					b,
					d,
					fromTimeMinutes,
					availabilityDates,
					timeZone,
				),
			);
		}
	}
	return map;
}
