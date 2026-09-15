import { getTimestampFromBlockIndex } from "./grid";
import type { SelectionStateType } from "./types";
import type { ZotDate } from "./zotdate";

/**
 * Personal-view cell state: what a cell is, what a drag or import would make
 * it, and which layers a renderer stacks to show both at once.
 */

export type PaintMode = "available" | "if-needed" | "unavailable";

export type CellPaintTarget = PaintMode;

export type ImportPreviewTarget = "available" | "if-needed" | null;

export interface PersonalCellState {
	isAvailable: boolean;
	isIfNeeded: boolean;
}

export function paintWillChange(
	mode: PaintMode,
	state: PersonalCellState,
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

/**
 * The cell's saved state as a paint target, from the user's own slots.
 * Available wins over if-needed so a slot in both reads as available.
 */
export function personalCellState(
	availableDay: ZotDate,
	ifNeededDay: ZotDate | null | undefined,
	blockIndex: number,
): PersonalCellState {
	const isAvailable = availableDay.getBlockAvailability(blockIndex);
	return {
		isAvailable,
		isIfNeeded:
			!isAvailable && (ifNeededDay?.getBlockAvailability(blockIndex) ?? false),
	};
}

export function effectiveCellTarget(
	state: PersonalCellState,
	draft: { isInDraftRange: boolean; paintMode: PaintMode },
	importPreview?: ImportPreviewTarget,
): CellPaintTarget {
	if (draft.isInDraftRange && paintWillChange(draft.paintMode, state)) {
		return draft.paintMode;
	}
	if (importPreview) return importPreview;
	if (state.isAvailable) return "available";
	if (state.isIfNeeded) return "if-needed";
	return "unavailable";
}

/** What an import would do to this slot, given the preview sets. */
export function importPreviewTargetFor(
	slotIso: string,
	importPreview:
		| {
				availableIsoSet: ReadonlySet<string>;
				ifNeededIsoSet: ReadonlySet<string>;
		  }
		| null
		| undefined,
): ImportPreviewTarget {
	if (!importPreview || !slotIso) return null;
	if (importPreview.ifNeededIsoSet.has(slotIso)) return "if-needed";
	if (importPreview.availableIsoSet.has(slotIso)) return "available";
	return null;
}

/**
 * The layer stack a personal cell draws, bottom to top. Each renderer maps
 * these to its own primitives (absolutely-positioned divs on the web, `View`s
 * on native) but the decision of *what* to draw is made once, here.
 *
 * - `paperBase`: opaque paper, or dimmed to let the if-needed stripes show
 *   through when the cell is (or previews as) if-needed. `null` draws nothing,
 *   which is how a saved if-needed cell exposes the stripes.
 * - `available`: the solid primary fill, dimmed while a preview overrides it.
 * - `previewAvailable`: the 40% primary wash previewing "will be available".
 * - `previewUnpaint`: the 60% paper wash previewing "will be unavailable".
 */
export interface PersonalCellLayers {
	paperBase: { opacity: number } | null;
	available: { opacity: number } | null;
	previewAvailable: boolean;
	previewUnpaint: boolean;
}

export function personalCellLayers(
	state: PersonalCellState,
	draft: { isInDraftRange: boolean; paintMode: PaintMode },
	importPreview: ImportPreviewTarget = null,
): PersonalCellLayers {
	const draftTarget: CellPaintTarget | null =
		draft.isInDraftRange && paintWillChange(draft.paintMode, state)
			? draft.paintMode
			: null;
	const importTarget: CellPaintTarget | null =
		!draftTarget && importPreview && paintWillChange(importPreview, state)
			? importPreview
			: null;
	const previewTarget = draftTarget ?? importTarget;

	const previewWillBeNonIfNeeded =
		previewTarget !== null && previewTarget !== "if-needed";
	const renderPaperBase = !state.isIfNeeded || previewWillBeNonIfNeeded;

	return {
		paperBase: renderPaperBase
			? { opacity: previewTarget === "if-needed" ? 0.6 : 1 }
			: null,
		available: state.isAvailable
			? { opacity: previewTarget && previewTarget !== "available" ? 0.4 : 1 }
			: null,
		previewAvailable: previewTarget === "available" && !state.isAvailable,
		previewUnpaint:
			draftTarget === "unavailable" && (state.isAvailable || state.isIfNeeded),
	};
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

/** Clears the member's own available / if-needed slots, keeping everyone else's. */
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
