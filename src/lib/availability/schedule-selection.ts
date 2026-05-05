import { getTimestampFromBlockIndex } from "@/lib/availability/utils";
import type { SelectionStateType } from "@/lib/types/availability";
import type { ZotDate } from "@/lib/zotdate";

/**
 * Returns the ISO timestamps for every 15-minute block covered by a schedule
 * selection. Because schedule drags are always locked to the start row (via
 * `lockToStartRow: true` in the drag hook), only `earlierBlockIndex`..
 * `laterBlockIndex` on `earlierDateIndex` are walked.
 */
export function applyScheduleSelection(args: {
	availabilityDates: ZotDate[];
	range: SelectionStateType;
	fromTimeMinutes: number;
	timeZone: string;
}): string[] {
	const { availabilityDates, range, fromTimeMinutes, timeZone } = args;
	const day = range.earlierDateIndex;
	const timestamps: string[] = [];
	for (
		let blockIndex = range.earlierBlockIndex;
		blockIndex <= range.laterBlockIndex;
		blockIndex++
	) {
		const timestamp = getTimestampFromBlockIndex(
			blockIndex,
			day,
			fromTimeMinutes,
			availabilityDates,
			timeZone,
		);
		if (timestamp) timestamps.push(timestamp);
	}
	return timestamps;
}
