import { BLOCK_LENGTH } from "@zotmeet/shared";
import { differenceInCalendarDays } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { ZotDate } from "@/lib/zotdate";

/*
 * The pure time helpers moved to `@zotmeet/shared` so the Expo app can use
 * them; they are re-exported here to keep this module's import path stable.
 * Everything that touches `ZotDate` stays below.
 */
export {
	BLOCK_LENGTH,
	convertTimeFromUTC,
	convertTimeToUTC,
	formatDateToUSNumeric,
	formatScheduledTimeRange,
	formatTimeWithHoursAndMins,
	generateTimeBlocks,
	getDatePart,
	getMinutesFromMidnight,
	getTimeFromHourMinuteString,
	sortMeetingIsoDatesAsc,
} from "@zotmeet/shared";

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

export type PageEdgeVariant = "none" | "first" | "middle" | "last";

export function getPageEdgeVariant(
	hasMultiplePages: boolean,
	isFirstPage: boolean,
	isLastPage: boolean,
): PageEdgeVariant {
	if (!hasMultiplePages) return "none";
	if (isFirstPage) return "first";
	if (isLastPage) return "last";
	return "middle";
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

function computeSpillover(
	currentPageAvailability: (ZotDate | null)[],
	doesntNeedDay: boolean,
): { insertAtIndex: number; day: ZotDate } | null {
	if (doesntNeedDay) return null;

	let dayIndex = currentPageAvailability.length - 1;
	while (dayIndex >= 0 && currentPageAvailability[dayIndex] == null) {
		dayIndex -= 1;
	}
	if (dayIndex < 0) return null;

	const prevDay = currentPageAvailability[dayIndex];
	if (!prevDay) return null;

	const newDay = new Date(prevDay.day);
	newDay.setDate(newDay.getDate() + 1);

	return {
		insertAtIndex: dayIndex + 1,
		day: new ZotDate(
			newDay,
			prevDay.earliestTime,
			prevDay.latestTime,
			false,
			[],
			{},
			prevDay.ianaTimeZone,
		),
	};
}

export function cloneBlocks(
	currentPageAvailability: (ZotDate | null)[],
	doesntNeedDay: boolean,
): (ZotDate | null)[] {
	const newBlocks: (ZotDate | null)[] = currentPageAvailability.map((date) =>
		date ? new ZotDate(date) : null,
	);
	const spillover = computeSpillover(currentPageAvailability, doesntNeedDay);
	if (spillover) newBlocks[spillover.insertAtIndex] = spillover.day;
	return newBlocks;
}

export function cloneDates(
	currentPageAvailability: (ZotDate | null)[],
	availabilityDates: ZotDate[],
	doesntNeedDay: boolean,
): ZotDate[] {
	const newDates = availabilityDates.map((date) => new ZotDate(date));
	const spillover = computeSpillover(currentPageAvailability, doesntNeedDay);
	if (spillover) newDates.push(spillover.day);
	return newDates;
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

/** Stable key for comparing member rosters (order-independent). */
export function memberIdsKey(memberIds: readonly string[]): string {
	return [...memberIds].sort().join(",");
}

/** Drops removed members from group heatmap buckets; omits empty buckets. */
export function pruneGroupAvailabilityByMemberIds(
	dates: readonly ZotDate[],
	validIds: ReadonlySet<string>,
): ZotDate[] {
	return dates.map((date) => {
		const newGroupAvail: Record<string, string[]> = {};
		for (const [ts, ids] of Object.entries(date.groupAvailability)) {
			const filtered = ids.filter((id) => validIds.has(id));
			if (filtered.length > 0) newGroupAvail[ts] = filtered;
		}
		const cloned = new ZotDate(date);
		cloned.groupAvailability = newGroupAvail;
		return cloned;
	});
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
