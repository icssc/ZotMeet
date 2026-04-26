"use client";

import { alpha, useTheme } from "@mui/material/styles";
import React, { useCallback, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { GroupAvailabilityBlock } from "@/components/availability/group-availability-block";
import {
	type GridCell,
	useGridDragSelection,
} from "@/hooks/use-grid-drag-selection";

import {
	formatScheduledTimeRange,
	generateDateKey,
	getTimestampFromBlockIndex,
	spacerBeforeDate,
} from "@/lib/availability/utils";
import type { Member, SelectionStateType } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

function calculateBlockColor({
	block,
	hoveredMember,
	selectedMembers,
	numMembers,
	showBestTimes,
	maxAvailability,
	primaryColor,
	ifNeededBlock,
}: {
	block: string[];
	hoveredMember: string | null;
	selectedMembers: string[];
	numMembers: number;
	showBestTimes: boolean;
	maxAvailability: number;
	primaryColor: string;
	ifNeededBlock: string[];
}): string {
	if (selectedMembers.length) {
		const selectedInBlock = selectedMembers.filter((memberId) =>
			block.includes(memberId),
		);
		const ifNeededInBlock = selectedMembers.filter((memberId) =>
			ifNeededBlock.includes(memberId),
		);

		if (selectedInBlock.length) {
			const proportion = selectedInBlock.length / selectedMembers.length;
			return alpha(primaryColor, proportion); // available = pink
		}
		if (ifNeededInBlock.length) {
			const proportion = ifNeededInBlock.length / selectedMembers.length;
			return `rgba(0, 100, 137, ${proportion})`; // if-needed = blue
		}
		return "transparent";
	}

	if (hoveredMember) {
		if (block.includes(hoveredMember)) {
			return alpha(primaryColor, 1); // available = pink
		}
		if (ifNeededBlock.includes(hoveredMember)) {
			return "rgba(0, 100, 137, 1)"; // if-needed = blue
		}
		return "transparent";
	}

	if (showBestTimes) {
		if (block.length === maxAvailability && maxAvailability > 0) {
			return "rgba(242, 100, 137, 1)";
		}
		return "transparent";
	}

	if (numMembers) {
		if (ifNeededBlock.length > 0) {
			const opacity = ifNeededBlock.length / numMembers;
			return `rgba(0, 100, 137, ${opacity})`; // if-needed = blue
		}
		if (block.length > 0) {
			const opacity = block.length / numMembers;
			return alpha(primaryColor, opacity); // available = pink
		}
	}

	return "transparent";
}

function rangesEqual(
	a: SelectionStateType | undefined,
	b: SelectionStateType | undefined,
): boolean {
	if (!a || !b) return false;
	return (
		a.earlierDateIndex === b.earlierDateIndex &&
		a.laterDateIndex === b.laterDateIndex &&
		a.earlierBlockIndex === b.earlierBlockIndex &&
		a.laterBlockIndex === b.laterBlockIndex
	);
}

interface GroupAvailabilityProps {
	meetingId: string;
	meetingTitle?: string;
	timeBlock: number;
	blockIndex: number;
	availabilityTimeBlocks: number[];
	fromTime: number;
	availabilityDates: ZotDate[];
	currentPageAvailability: {
		availabilities: ZotDate[];
		ifNeeded: ZotDate[];
	};
	members: Member[];
	onMouseLeave: () => void;
	isScheduling: boolean;
	timeZone: string;
	onCommitSchedule: (range: SelectionStateType) => void;
}

export function GroupAvailability({
	meetingTitle,
	timeBlock,
	blockIndex,
	availabilityTimeBlocks,
	fromTime,
	availabilityDates,
	currentPageAvailability,
	members,
	onMouseLeave,
	isScheduling,
	timeZone,
	onCommitSchedule,
}: GroupAvailabilityProps) {
	const theme = useTheme();

	const { currentPage, itemsPerPage } = useAvailabilityStore(
		useShallow((state) => ({
			currentPage: state.currentPage,
			itemsPerPage: state.itemsPerPage,
		})),
	);

	const {
		committedRange,
		selectionState,
		selectionIsLocked,
		hoveredMember,
		selectedMembers,
		setCommittedRange,
		setSelectionIsLocked,
		setSelectionState,
		setIsMobileDrawerOpen,
		toggleHoverGrid,
	} = useAvailabilityStore(
		useShallow((state) => ({
			committedRange: state.committedRange,
			selectionState: state.selectionState,
			selectionIsLocked: state.selectionIsLocked,
			hoveredMember: state.hoveredMember,
			selectedMembers: state.selectedMembers,
			setCommittedRange: state.setCommittedRange,
			setSelectionIsLocked: state.setSelectionIsLocked,
			setSelectionState: state.setSelectionState,
			setIsMobileDrawerOpen: state.setIsMobileDrawerOpen,
			toggleHoverGrid: state.toggleHoverGrid,
		})),
	);

	const numMembers = members.length;
	const showBestTimes = useAvailabilityStore((state) => state.enabled);

	const { scheduledTimes, pendingAdds, pendingRemovals } = useAvailabilityStore(
		useShallow((state) => ({
			scheduledTimes: state.scheduledTimes,
			pendingAdds: state.pendingAdds,
			pendingRemovals: state.pendingRemovals,
		})),
	);

	const { scheduledTimeRange, scheduledBlockCount } = useMemo(() => {
		const effective = new Set([...scheduledTimes, ...pendingAdds]);
		for (const ts of pendingRemovals) {
			effective.delete(ts);
		}
		return {
			scheduledTimeRange: formatScheduledTimeRange([...effective]),
			scheduledBlockCount: effective.size,
		};
	}, [scheduledTimes, pendingAdds, pendingRemovals]);

	const maxAvailability = useMemo(() => {
		if (!showBestTimes || numMembers === 0) return 0;

		let max = 0;
		availabilityDates.forEach((date) => {
			Object.values(date.groupAvailability).forEach((memberIds) => {
				max = Math.max(max, memberIds.length);
			});
		});
		return max;
	}, [showBestTimes, numMembers, availabilityDates]);

	const isScheduled = useAvailabilityStore((state) => state.isScheduled);

	const handlers = useGridDragSelection(
		useMemo(
			() => ({
				enabled: true,
				lockToStartRow: isScheduling,
				onDragUpdate: (range) => setSelectionState(range),
				onCommit: (range, { isTap }) => {
					setSelectionState(undefined);
					if (isScheduling) {
						onCommitSchedule(range);
						return;
					}
					// Group view: tap on the currently-committed range unlocks it.
					if (
						isTap &&
						selectionIsLocked &&
						rangesEqual(committedRange, range)
					) {
						setSelectionIsLocked(false);
						setCommittedRange(undefined);
						return;
					}
					setCommittedRange(range);
					setSelectionIsLocked(true);
					setIsMobileDrawerOpen(true);
					toggleHoverGrid(true);
				},
				onCancel: () => setSelectionState(undefined),
			}),
			[
				isScheduling,
				selectionIsLocked,
				committedRange,
				onCommitSchedule,
				setCommittedRange,
				setSelectionIsLocked,
				setSelectionState,
				setIsMobileDrawerOpen,
				toggleHoverGrid,
			],
		),
	);

	const handleCellHover = useCallback(
		({ zotDateIndex, blockIndex: hoverBlockIndex }: GridCell) => {
			toggleHoverGrid(true);
			if (isScheduling || selectionIsLocked) return;
			setCommittedRange({
				earlierDateIndex: zotDateIndex,
				laterDateIndex: zotDateIndex,
				earlierBlockIndex: hoverBlockIndex,
				laterBlockIndex: hoverBlockIndex,
			});
		},
		[isScheduling, selectionIsLocked, setCommittedRange, toggleHoverGrid],
	);

	const isTopOfHour = timeBlock % 60 === 0;
	const isHalfHour = timeBlock % 60 === 30;
	const isLastRow = blockIndex === availabilityTimeBlocks.length - 1;

	const spacers = spacerBeforeDate(currentPageAvailability["availabilities"]);

	return currentPageAvailability.availabilities.map(
		(selectedDate, pageDateIndex) => {
			const ifNeededDate = currentPageAvailability.ifNeeded[pageDateIndex];

			const key = generateDateKey({
				selectedDate,
				timeBlock,
				pageDateIndex,
			});

			if (selectedDate) {
				const zotDateIndex = pageDateIndex + currentPage * itemsPerPage;

				const isInCommittedRange =
					!isScheduling &&
					committedRange !== undefined &&
					committedRange.earlierDateIndex <= zotDateIndex &&
					zotDateIndex <= committedRange.laterDateIndex &&
					committedRange.earlierBlockIndex <= blockIndex &&
					blockIndex <= committedRange.laterBlockIndex;

				const isInDraftRange =
					selectionState !== undefined &&
					selectionState.earlierDateIndex <= zotDateIndex &&
					zotDateIndex <= selectionState.laterDateIndex &&
					selectionState.earlierBlockIndex <= blockIndex &&
					blockIndex <= selectionState.laterBlockIndex;

				const timestamp = getTimestampFromBlockIndex(
					blockIndex,
					zotDateIndex,
					fromTime,
					availabilityDates,
					timeZone,
				);

				const block = selectedDate.groupAvailability[timestamp] || [];
				const ifNeededBlock = ifNeededDate?.groupAvailability[timestamp] || [];
				const blockColor = calculateBlockColor({
					block,
					hoveredMember,
					selectedMembers,
					numMembers,
					showBestTimes,
					maxAvailability,
					ifNeededBlock,
					primaryColor: theme.palette.primary.main,
				});
				const blockIsScheduled = isScheduled(timestamp);

				const prevTimestamp =
					blockIndex > 0
						? getTimestampFromBlockIndex(
								blockIndex - 1,
								zotDateIndex,
								fromTime,
								availabilityDates,
								timeZone,
							)
						: "";
				const nextTimestamp =
					blockIndex < availabilityTimeBlocks.length - 1
						? getTimestampFromBlockIndex(
								blockIndex + 1,
								zotDateIndex,
								fromTime,
								availabilityDates,
								timeZone,
							)
						: "";
				const isTopEdge =
					blockIsScheduled && (!prevTimestamp || !isScheduled(prevTimestamp));
				const isBottomEdge =
					blockIsScheduled && (!nextTimestamp || !isScheduled(nextTimestamp));

				const tableCellStyles = cn(
					isTopOfHour ? "border-t-[1px] border-t-gray-base" : "",
					isHalfHour
						? "border-t border-t-gray-base [border-top-style:dotted]"
						: "",
					isLastRow ? "border-b-[1px]" : "",
					isInCommittedRange
						? "outline-dashed outline-2 outline-slate-500"
						: "",
					isInDraftRange ? "ring-2 ring-primary/60 ring-inset" : "",
				);

				return (
					<React.Fragment key={key}>
						{spacers[pageDateIndex] && (
							<td className="w-3 md:w-4" aria-hidden="true" />
						)}
						<td className={cn("px-0 py-0", isTopEdge && "relative z-[1]")}>
							<GroupAvailabilityBlock
								className={cn(
									"group-availability-block block",
									isScheduling && "cursor-row-resize [touch-action:pinch-zoom]",
								)}
								onClick={() =>
									handlers.onKeyCommit({ zotDateIndex, blockIndex })
								}
								onHover={() =>
									handleCellHover({
										zotDateIndex,
										blockIndex,
									})
								}
								onPointerDown={handlers.onPointerDown}
								onPointerMove={handlers.onPointerMove}
								onPointerUp={handlers.onPointerUp}
								onPointerCancel={handlers.onPointerCancel}
								blockColor={blockColor}
								isScheduled={blockIsScheduled}
								isScheduledTopEdge={isTopEdge}
								isScheduledBottomEdge={isBottomEdge}
								scheduledMeetingTitle={isTopEdge ? meetingTitle : undefined}
								scheduledTimeRange={isTopEdge ? scheduledTimeRange : undefined}
								scheduledBlockCount={
									isTopEdge ? scheduledBlockCount : undefined
								}
								tableCellStyles={tableCellStyles}
								hasSpacerBefore={spacers[pageDateIndex]}
								dateIndex={zotDateIndex}
								blockIndex={blockIndex}
							/>
						</td>
					</React.Fragment>
				);
			} else {
				return (
					// Because these elements are hidden spacers, we consider mouse hovers to be "leaving" the table
					<React.Fragment key={key}>
						{spacers[pageDateIndex] && (
							<td
								className="w-3 md:w-4"
								aria-hidden="true"
								onMouseEnter={onMouseLeave}
							/>
						)}
						<td onMouseEnter={onMouseLeave}></td>
					</React.Fragment>
				);
			}
		},
	);
}
