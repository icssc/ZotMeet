import { formatInTimeZone } from "date-fns-tz";
import { ZotDate } from "@/lib/zotdate";

/*
 * The pure time and grid helpers moved to `@zotmeet/shared` so the Expo app
 * can use them; they are re-exported here to keep this module's import path
 * stable. What stays below is the import/merge bookkeeping only the web needs.
 */
export {
	BLOCK_LENGTH,
	buildMeetingGridIsoSet,
	buildTimestampsByCell,
	buildZotDateRowsForMeetingDays,
	clearPersonalGridSlots,
	convertTimeFromUTC,
	convertTimeToUTC,
	formatDateToUSNumeric,
	formatScheduledTimeRange,
	formatTimeWithHoursAndMins,
	generateCellKey,
	generateDateKey,
	generateTimeBlocks,
	getDatePart,
	getMinutesFromMidnight,
	getRowChrome,
	getTimeFromHourMinuteString,
	getTimestampFromBlockIndex,
	isoStringForSlot,
	type RowChrome,
	sortMeetingIsoDatesAsc,
	spacerBeforeDate,
} from "@zotmeet/shared";

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
