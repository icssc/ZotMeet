import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { BLOCK_LENGTH } from "@/lib/availability/utils";
import type { ZotDate } from "@/lib/zotdate";

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
		const dayStart = fromZonedTime(`${datePart}T00:00:00`, timeZone);
		return new Date(
			dayStart.getTime() + totalMinutes * 60 * 1000,
		).toISOString();
	}

	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	const date = new Date(selectedDate.day);
	date.setHours(hours, minutes, 0, 0);

	return date.toISOString();
}
