import { getTimestampFromBlockIndex } from "@/lib/availability/utils";
import type { SelectionStateType } from "@/lib/types/availability";
import type { ZotDate } from "@/lib/zotdate";

export type PaintMode = "available" | "if-needed" | "unavailable";

export function paintWillChange(
	mode: PaintMode,
	state: { isAvailable: boolean; isIfNeeded: boolean },
): boolean {
	switch (mode) {
		case "available":
			return !state.isAvailable;
		case "if-needed":
			return !state.isIfNeeded;
		case "unavailable":
			return state.isAvailable || state.isIfNeeded;
	}
}

export type CellPaintTarget = PaintMode;

export function effectiveCellTarget(
	state: { isAvailable: boolean; isIfNeeded: boolean },
	draft: { isInDraftRange: boolean; paintMode: PaintMode },
): CellPaintTarget {
	if (draft.isInDraftRange && paintWillChange(draft.paintMode, state)) {
		return draft.paintMode;
	}
	if (state.isAvailable) return "available";
	if (state.isIfNeeded) return "if-needed";
	return "unavailable";
}

export function paintPersonalSelection(args: {
	availabilityDates: ZotDate[];
	ifNeededDates: ZotDate[];
	mode: PaintMode;
	range: SelectionStateType;
	memberId: string;
	fromTimeMinutes: number;
	timeZone: string;
}): { availabilityDates: ZotDate[]; ifNeededDates: ZotDate[] } {
	const {
		availabilityDates,
		ifNeededDates,
		mode,
		range,
		memberId,
		fromTimeMinutes,
		timeZone,
	} = args;

	const setOnAvailable = mode === "available";
	const setOnIfNeeded = mode === "if-needed";

	const updatedAvailable = availabilityDates.map((d) => d.clone());
	const updatedIfNeeded = ifNeededDates.map((d) => d.clone());

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
		const availableDay = updatedAvailable[dateIndex];
		const ifNeededDay = updatedIfNeeded[dateIndex];
		if (!availableDay) continue;

		availableDay.setBlockAvailabilities(
			earlierBlockIndex,
			laterBlockIndex,
			setOnAvailable,
		);
		if (ifNeededDay) {
			ifNeededDay.setBlockAvailabilities(
				earlierBlockIndex,
				laterBlockIndex,
				setOnIfNeeded,
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

			applyMemberToBucket(availableDay, timestamp, memberId, setOnAvailable);
			if (ifNeededDay) {
				applyMemberToBucket(ifNeededDay, timestamp, memberId, setOnIfNeeded);
			}
		}
	}

	return {
		availabilityDates: updatedAvailable,
		ifNeededDates: updatedIfNeeded,
	};
}

function applyMemberToBucket(
	day: ZotDate,
	timestamp: string,
	memberId: string,
	present: boolean,
): void {
	const bucket = day.groupAvailability[timestamp] ?? [];
	const has = bucket.includes(memberId);
	if (present && !has) {
		day.groupAvailability[timestamp] = [...bucket, memberId];
	} else if (!present && has) {
		day.groupAvailability[timestamp] = bucket.filter((id) => id !== memberId);
	} else if (!day.groupAvailability[timestamp]) {
		day.groupAvailability[timestamp] = bucket;
	}
}
