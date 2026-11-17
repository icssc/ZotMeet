import { rangeCoversCell, type SelectionStateType } from "./types";
import type { ZotDate } from "./zotdate";

/**
 * Group-view cell fill. Colour-agnostic: `solid.ratio` is the share of the
 * denominator that is available (the web maps it through MUI's `alpha`, native
 * through the primary token's opacity) and `stripes.opacity` the share that is
 * if-needed, shown by letting the stripe backdrop through the paper base.
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
}

/** Priority: a member filter, then a hovered member, then best-times, then everyone. */
export function calculateBlockFill({
	block,
	ifNeededBlock,
	hoveredMember,
	selectedMembers,
	numMembers,
	showBestTimes,
	maxAvailability,
}: BlockFillInput): BlockFill {
	if (selectedMembers.length) {
		const selectedAvailable = selectedMembers.filter((memberId) =>
			block.includes(memberId),
		).length;
		const selectedIfNeeded = selectedMembers.filter((memberId) =>
			ifNeededBlock.includes(memberId),
		).length;
		return proportionalFill(
			selectedAvailable,
			selectedIfNeeded,
			selectedMembers.length,
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
			return proportionalFill(block.length, ifNeededBlock.length, numMembers);
		}
		return EMPTY_FILL;
	}

	if (numMembers) {
		return proportionalFill(block.length, ifNeededBlock.length, numMembers);
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
