import { getTimestampFromBlockIndex } from "@/lib/availability/utils";
import type { SelectionStateType } from "@/lib/types/availability";
import type { ZotDate } from "@/lib/zotdate";

export type PersonalMode = "available" | "if-needed";

export interface GridCellLike {
	zotDateIndex: number;
	blockIndex: number;
}

/**
 * Applies a personal-availability drag commit to both the "available" and "if-needed"
 * grids. Returns fresh `ZotDate[]` arrays; the inputs are not mutated.
 *
 * The toggle value is derived from `startCell`'s current value on the active mode's
 * grid, then applied to every cell in `range`. When toggling to `true`, the same
 * range is cleared from the opposite mode (a cell can be "available" or "if-needed"
 * but not both).
 */
export function applyPersonalSelection(args: {
	availabilityDates: ZotDate[];
	ifNeededDates: ZotDate[];
	mode: PersonalMode;
	range: SelectionStateType;
	startCell: GridCellLike;
	memberId: string;
	fromTimeMinutes: number;
	timeZone: string;
}): { availabilityDates: ZotDate[]; ifNeededDates: ZotDate[] } {
	const {
		availabilityDates,
		ifNeededDates,
		mode,
		range,
		startCell,
		memberId,
		fromTimeMinutes,
		timeZone,
	} = args;

	const activeIsAvailable = mode === "available";
	const ref = activeIsAvailable ? availabilityDates : ifNeededDates;
	const otherRef = activeIsAvailable ? ifNeededDates : availabilityDates;

	const startZotDate = ref[startCell.zotDateIndex];
	if (!startZotDate) {
		return { availabilityDates, ifNeededDates };
	}
	const toggleValue = !startZotDate.getBlockAvailability(startCell.blockIndex);

	const updatedActive = ref.map((d) => d.clone());
	const updatedOther = otherRef.map((d) => d.clone());

	const {
		earlierDateIndex,
		laterDateIndex,
		earlierBlockIndex,
		laterBlockIndex,
	} = range;

	for (
		let dateIndex = earlierDateIndex;
		dateIndex <= laterDateIndex;
		dateIndex++
	) {
		const currentDate = updatedActive[dateIndex];
		const otherDate = updatedOther[dateIndex];
		if (!currentDate) continue;

		currentDate.setBlockAvailabilities(
			earlierBlockIndex,
			laterBlockIndex,
			toggleValue,
		);
		if (toggleValue && otherDate) {
			otherDate.setBlockAvailabilities(
				earlierBlockIndex,
				laterBlockIndex,
				false,
			);
		}

		for (
			let blockIndex = earlierBlockIndex;
			blockIndex <= laterBlockIndex;
			blockIndex++
		) {
			const timestamp = getTimestampFromBlockIndex(
				blockIndex,
				dateIndex,
				fromTimeMinutes,
				availabilityDates,
				timeZone,
			);
			if (!timestamp) continue;

			if (!currentDate.groupAvailability[timestamp]) {
				currentDate.groupAvailability[timestamp] = [];
			}

			if (toggleValue) {
				if (!currentDate.groupAvailability[timestamp].includes(memberId)) {
					currentDate.groupAvailability[timestamp].push(memberId);
				}
				if (otherDate?.groupAvailability[timestamp]) {
					otherDate.groupAvailability[timestamp] = otherDate.groupAvailability[
						timestamp
					].filter((id) => id !== memberId);
				}
			} else {
				currentDate.groupAvailability[timestamp] =
					currentDate.groupAvailability[timestamp].filter(
						(id) => id !== memberId,
					);
			}
		}
	}

	return activeIsAvailable
		? { availabilityDates: updatedActive, ifNeededDates: updatedOther }
		: { availabilityDates: updatedOther, ifNeededDates: updatedActive };
}

/**
 * Applies a schedule drag commit and returns the ISO timestamps for every 15-minute
 * block covered by the range. Because schedule drags are always locked to the start
 * row, only `earlierBlockIndex`..`laterBlockIndex` on `earlierDateIndex` are walked.
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
