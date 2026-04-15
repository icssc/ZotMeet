import { getTimestampFromBlockIndex } from "@/lib/availability/grid-timestamps";
import { ZotDate } from "@/lib/zotdate";

/** Same day layout as `deriveInitialAvailability` in availability.tsx, without member data. */
export function buildZotDateRowsForMeetingDays(
	meetingDates: string[],
	availabilityTimeBlocks: number[],
): ZotDate[] {
	return meetingDates
		.map((meetingDate) => {
			const dateStr = meetingDate.split("T")[0];
			const [year, month, day] = dateStr.split("-").map(Number);
			const date = new Date(year, month - 1, day);

			const earliestMinutes = availabilityTimeBlocks[0] ?? 480;
			const latestMinutes =
				(availabilityTimeBlocks[availabilityTimeBlocks.length - 1] ?? 1035) +
				15;

			return new ZotDate(date, earliestMinutes, latestMinutes, false, [], {});
		})
		.sort((a, b) => a.day.getTime() - b.day.getTime());
}

export function buildMeetingGridIsoSet(
	availabilityDates: ZotDate[],
	fromTimeMinutes: number,
	blockCount: number,
): Set<string> {
	const set = new Set<string>();
	for (let d = 0; d < availabilityDates.length; d++) {
		for (let b = 0; b < blockCount; b++) {
			const iso = getTimestampFromBlockIndex(
				b,
				d,
				fromTimeMinutes,
				availabilityDates,
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

/** Merges grid-filtered slot ISOs into local editor state (caller persists via Save). */
export function mergeImportedGridSlots(
	availabilityDates: readonly ZotDate[],
	slotIsoStrings: readonly string[],
	memberId: string,
): ZotDate[] {
	const updated = availabilityDates.map((d) => d.clone());
	const unique = new Set(slotIsoStrings);

	for (const iso of unique) {
		const slotDay = new Date(iso).toLocaleDateString("en-CA");
		const zot = updated.find(
			(z) => z.day.toLocaleDateString("en-CA") === slotDay,
		);
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
