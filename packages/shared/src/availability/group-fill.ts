import { rangeCoversCell, type SelectionStateType } from "./types";
import type { ZotDate } from "./zotdate";

/**
 * Group-view cell fill. Colour-agnostic. `solid.ratio` scales this slot's
 * available headcount from the quietest painted slot (0) to the busiest (1).
 * When every painted slot shares one headcount the ratio is 1, and a hovered
 * member is 1 or the solid layer is absent. `stripes.opacity` is the if-needed
 * count divided by the denominator — the member filter, the hovered member, or
 * everyone — shown by letting the stripe backdrop through the paper base.
 */
export type BlockFill = {
	solid: { ratio: number } | null;
	stripes: { opacity: number } | null;
};

export const EMPTY_FILL: BlockFill = { solid: null, stripes: null };

export function proportionalFill(
	available: number,
	ifNeeded: number,
	denominator: number,
): BlockFill {
	if (denominator === 0) return EMPTY_FILL;
	return {
		solid: available > 0 ? { ratio: available / denominator } : null,
		stripes: ifNeeded > 0 ? { opacity: ifNeeded / denominator } : null,
	};
}

/** Available-headcount range across the slots being compared. */
export interface AvailabilityExtent {
	min: number;
	max: number;
}

export const EMPTY_EXTENT: AvailabilityExtent = { min: 0, max: 0 };

function availableCount(
	block: readonly string[],
	selectedMembers: readonly string[],
): number {
	if (!selectedMembers.length) return block.length;
	let count = 0;
	for (const memberId of selectedMembers) {
		if (block.includes(memberId)) count++;
	}
	return count;
}

/**
 * Min and max number of people available in any slot. Empty slots are ignored,
 * so the scale runs from the quietest painted cell to the busiest, not from
 * zero to the group size. A member filter counts only those members.
 */
export function computeAvailabilityExtent(
	availabilityDates: readonly ZotDate[],
	selectedMembers: readonly string[] = [],
): AvailabilityExtent {
	let min = Number.POSITIVE_INFINITY;
	let max = 0;
	for (const day of availabilityDates) {
		for (const block of Object.values(day?.groupAvailability ?? {})) {
			const count = availableCount(block, selectedMembers);
			if (count <= 0) continue;
			min = Math.min(min, count);
			max = Math.max(max, count);
		}
	}
	if (min === Number.POSITIVE_INFINITY) return EMPTY_EXTENT;
	return { min, max };
}

/** 0 at the quietest slot, 1 at the busiest. A single headcount fills fully. */
export function scaleAvailability(
	count: number,
	extent: AvailabilityExtent,
): number {
	if (count <= 0 || extent.max <= 0) return 0;
	if (extent.max === extent.min) return 1;
	return (count - extent.min) / (extent.max - extent.min);
}

export interface BlockFillInput {
	/** Member ids available in this slot. */
	block: readonly string[];
	/** Member ids if-needed in this slot. */
	ifNeededBlock: readonly string[];
	hoveredMember: string | null;
	selectedMembers: readonly string[];
	numMembers: number;
	showBestTimes: boolean;
	/** From `computeMaxAvailability`; only read when `showBestTimes`. */
	maxAvailability: number;
	/** From `computeAvailabilityExtent`. */
	availabilityExtent: AvailabilityExtent;
}

/** Priority: a member filter, then a hovered member, then best-times, then everyone. */
function fillWithScaledAvailability(
	available: number,
	ifNeeded: number,
	denominator: number,
	extent: AvailabilityExtent,
): BlockFill {
	const fill = proportionalFill(available, ifNeeded, denominator);
	if (!fill.solid) return fill;
	return { ...fill, solid: { ratio: scaleAvailability(available, extent) } };
}

export function calculateBlockFill({
	block,
	ifNeededBlock,
	hoveredMember,
	selectedMembers,
	numMembers,
	showBestTimes,
	maxAvailability,
	availabilityExtent,
}: BlockFillInput): BlockFill {
	if (selectedMembers.length) {
		const selectedAvailable = availableCount(block, selectedMembers);
		const selectedIfNeeded = selectedMembers.filter((memberId) =>
			ifNeededBlock.includes(memberId),
		).length;
		return fillWithScaledAvailability(
			selectedAvailable,
			selectedIfNeeded,
			selectedMembers.length,
			availabilityExtent,
		);
	}

	if (hoveredMember) {
		return proportionalFill(
			block.includes(hoveredMember) ? 1 : 0,
			ifNeededBlock.includes(hoveredMember) ? 1 : 0,
			1,
		);
	}

	if (showBestTimes) {
		const combined = block.length + ifNeededBlock.length;
		if (combined === maxAvailability && maxAvailability > 0) {
			return fillWithScaledAvailability(
				block.length,
				ifNeededBlock.length,
				numMembers,
				availabilityExtent,
			);
		}
		return EMPTY_FILL;
	}

	if (numMembers) {
		return fillWithScaledAvailability(
			block.length,
			ifNeededBlock.length,
			numMembers,
			availabilityExtent,
		);
	}

	return EMPTY_FILL;
}

/** The largest available + if-needed head count in any slot; the "best times" bar. */
export function computeMaxAvailability(
	availabilityDates: readonly ZotDate[],
	ifNeededDates: readonly ZotDate[],
): number {
	let max = 0;
	for (let i = 0; i < availabilityDates.length; i++) {
		const availDay = availabilityDates[i];
		const ifNeededDay = ifNeededDates[i];
		const timestamps = new Set<string>([
			...Object.keys(availDay?.groupAvailability ?? {}),
			...Object.keys(ifNeededDay?.groupAvailability ?? {}),
		]);
		for (const ts of timestamps) {
			const a = availDay?.groupAvailability[ts]?.length ?? 0;
			const n = ifNeededDay?.groupAvailability[ts]?.length ?? 0;
			max = Math.max(max, a + n);
		}
	}
	return max;
}

export interface SelectionEdges {
	top: boolean;
	right: boolean;
	bottom: boolean;
	left: boolean;
}

/** Which sides of the cell sit on the boundary of `range`; `null` when outside it. */
export function edgesFor(
	range: SelectionStateType | undefined,
	zotDateIndex: number,
	blockIndex: number,
): SelectionEdges | null {
	if (!range || !rangeCoversCell(range, zotDateIndex, blockIndex)) return null;
	return {
		top: blockIndex === range.earlierBlockIndex,
		bottom: blockIndex === range.laterBlockIndex,
		left: zotDateIndex === range.earlierDateIndex,
		right: zotDateIndex === range.laterDateIndex,
	};
}

/**
 * The outline shown on the group grid: a live drag beats the hover preview,
 * which beats the committed selection (hidden while scheduling, where the
 * schedule block itself is the feedback).
 */
export function selectionEdgesFor(args: {
	draftRange: SelectionStateType | undefined;
	hoverRange: SelectionStateType | undefined;
	committedRange: SelectionStateType | undefined;
	isScheduling: boolean;
	zotDateIndex: number;
	blockIndex: number;
}): SelectionEdges | null {
	const { draftRange, hoverRange, committedRange, isScheduling } = args;
	const { zotDateIndex, blockIndex } = args;

	const draftEdges = edgesFor(draftRange, zotDateIndex, blockIndex);
	if (draftEdges) return draftEdges;
	const hoverEdges = edgesFor(hoverRange, zotDateIndex, blockIndex);
	if (hoverEdges) return hoverEdges;
	if (draftRange !== undefined || isScheduling) return null;
	return edgesFor(committedRange, zotDateIndex, blockIndex);
}

/** Whether a scheduled cell starts or ends its run within the column. */
export function scheduledEdgesFor(args: {
	timestamp: string;
	prevTimestamp: string;
	nextTimestamp: string;
	scheduledTimestamps: ReadonlySet<string>;
}): { isScheduled: boolean; isTopEdge: boolean; isBottomEdge: boolean } {
	const { timestamp, prevTimestamp, nextTimestamp, scheduledTimestamps } = args;
	const isScheduled = timestamp !== "" && scheduledTimestamps.has(timestamp);
	return {
		isScheduled,
		isTopEdge:
			isScheduled &&
			(!prevTimestamp || !scheduledTimestamps.has(prevTimestamp)),
		isBottomEdge:
			isScheduled &&
			(!nextTimestamp || !scheduledTimestamps.has(nextTimestamp)),
	};
}
