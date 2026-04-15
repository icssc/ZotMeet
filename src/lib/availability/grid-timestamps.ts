import { BLOCK_LENGTH } from "@/lib/availability/utils";
import type { ZotDate } from "@/lib/zotdate";

/** ISO string for the start of a 15-minute slot; matches ZotDate / drag-save encoding. */
export function getTimestampFromBlockIndex(
	blockIndex: number,
	zotDateIndex: number,
	fromTimeMinutes: number,
	availabilityDates: ZotDate[],
): string {
	const minutesFromMidnight = fromTimeMinutes + blockIndex * BLOCK_LENGTH;
	const hours = Math.floor(minutesFromMidnight / 60);
	const minutes = minutesFromMidnight % 60;

	const selectedDate = availabilityDates.at(zotDateIndex);
	if (!selectedDate) return "";

	const date = new Date(selectedDate.day);
	date.setHours(hours, minutes, 0, 0);

	return date.toISOString();
}
