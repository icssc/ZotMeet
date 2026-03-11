"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { GroupAvailabilityBlock } from "@/components/availability/group-availability-block";
import { generateDateKey, spacerBeforeDate } from "@/lib/availability/utils";
import type { Member } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";
import { useBestTimesToggleStore } from "@/store/useBestTimesToggleStore";
import { useBlockSelectionStore } from "@/store/useBlockSelectionStore";
import { useGroupSelectionStore } from "@/store/useGroupSelectionStore";
import { useScheduleSelectionStore } from "@/store/useScheduleSelectionStore";

export const getTimestampFromBlockIndex = (
	blockIndex: number,
	zotDateIndex: number,
	fromTime: number,
	availabilityDates: ZotDate[],
) => {
	const minutesFromMidnight = fromTime + blockIndex * 15;
	const hours = Math.floor(minutesFromMidnight / 60);
	const minutes = minutesFromMidnight % 60;

	const selectedDate = availabilityDates.at(zotDateIndex);

	if (!selectedDate) {
		return "";
	}

	const date = new Date(selectedDate.day);
	date.setHours(hours);
	date.setMinutes(minutes);
	date.setSeconds(0);
	date.setMilliseconds(0);

	const isoString = date.toISOString();
	return isoString;
};

function calculateBlockColor({
	block,
	hoveredMember,
	selectedMembers,
	numMembers,
	showBestTimes,
	maxAvailability,
}: {
	block: string[];
	hoveredMember: string | null;
	selectedMembers: string[];
	numMembers: number;
	showBestTimes: boolean;
	maxAvailability: number;
}): string {
	if (selectedMembers.length) {
		const selectedInBlock = selectedMembers.filter((memberId) =>
			block.includes(memberId),
		);
		if (selectedInBlock.length) {
			const proportion = selectedInBlock.length / selectedMembers.length;
			return `rgba(55, 124, 251, ${proportion})`;
		}
		return "transparent";
	}

	if (hoveredMember) {
		if (block.includes(hoveredMember)) {
			return "rgba(55, 124, 251)";
		}
		return "transparent";
	}

	if (showBestTimes) {
		if (block.length === maxAvailability && maxAvailability > 0) {
			return "rgba(55, 124, 251, 1)";
		}
		return "transparent";
	}

	if (numMembers) {
		const opacity = block.length / numMembers;
		return `rgba(55, 124, 251, ${opacity})`;
	}

	return "transparent";
}

interface GroupAvailabilityProps {
	meetingId: string;
	timeBlock: number;
	blockIndex: number;
	availabilityTimeBlocks: number[];
	fromTime: number;
	availabilityDates: ZotDate[];
	currentPageAvailability: ZotDate[];
	members: Member[];
	onMouseLeave: () => void;
	isScheduling: boolean;
}

export function GroupAvailability({
	timeBlock,
	blockIndex,
	availabilityTimeBlocks,
	fromTime,
	availabilityDates,
	currentPageAvailability,
	members,
	onMouseLeave,
	isScheduling,
}: GroupAvailabilityProps) {
	const { currentPage, itemsPerPage } = useAvailabilityPaginationStore(
		useShallow((state) => ({
			currentPage: state.currentPage,
			itemsPerPage: state.itemsPerPage,
		})),
	);

	const {
		selectedZotDateIndex,
		selectedBlockIndex,
		selectionIsLocked,
		hoveredMember,
		selectedMembers,
		setSelectedZotDateIndex,
		setSelectedBlockIndex,
		setSelectionIsLocked,
		setIsMobileDrawerOpen,
		toggleHoverGrid,
	} = useGroupSelectionStore(
		useShallow((state) => ({
			selectedZotDateIndex: state.selectedZotDateIndex,
			selectedBlockIndex: state.selectedBlockIndex,
			selectionIsLocked: state.selectionIsLocked,
			hoveredMember: state.hoveredMember,
			selectedMembers: state.selectedMembers,
			setSelectedZotDateIndex: state.setSelectedZotDateIndex,
			setSelectedBlockIndex: state.setSelectedBlockIndex,
			setSelectionIsLocked: state.setSelectionIsLocked,
			setIsMobileDrawerOpen: state.setIsMobileDrawerOpen,
			toggleHoverGrid: state.toggleHoverGrid,
		})),
	);

	const numMembers = members.length;
	const { enabled: showBestTimes } = useBestTimesToggleStore();

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

	const {
		startBlockSelection,
		endBlockSelection,
		setStartBlockSelection,
		setEndBlockSelection,
		selectionState,
		setSelectionState,
	} = useBlockSelectionStore(
		useShallow((state) => ({
			startBlockSelection: state.startBlockSelection,
			endBlockSelection: state.endBlockSelection,
			setStartBlockSelection: state.setStartBlockSelection,
			setEndBlockSelection: state.setEndBlockSelection,
			selectionState: state.selectionState,
			setSelectionState: state.setSelectionState,
		})),
	);

	const { isScheduled, replaceEntireSelection } = useScheduleSelectionStore(
		useShallow((state) => ({
			isScheduled: state.isScheduled,
			replaceEntireSelection: state.replaceEntireSelection,
		})),
	);
	// to load scheduled time blocks when meeting is loaded
	// Forces re-render when scheduled or pending times change

	useScheduleSelectionStore((state) => state.scheduledTimes.size);
	useScheduleSelectionStore((state) => state.pendingAdds.size);

	// update start and end block selection state
	useEffect(() => {
		if (startBlockSelection && endBlockSelection) {
			if (startBlockSelection.zotDateIndex !== endBlockSelection.zotDateIndex) {
				setSelectionState(undefined);
				return;
			}
			setSelectionState({
				earlierDateIndex: Math.min(
					startBlockSelection.zotDateIndex,
					endBlockSelection.zotDateIndex,
				),
				laterDateIndex: Math.max(
					startBlockSelection.zotDateIndex,
					endBlockSelection.zotDateIndex,
				),
				earlierBlockIndex: Math.min(
					startBlockSelection.blockIndex,
					endBlockSelection.blockIndex,
				),
				laterBlockIndex: Math.max(
					startBlockSelection.blockIndex,
					endBlockSelection.blockIndex,
				),
			});
		}
	}, [startBlockSelection, endBlockSelection, setSelectionState]);

	const updateSelection = useCallback(
		({
			zotDateIndex,
			blockIndex,
		}: {
			zotDateIndex: number;
			blockIndex: number;
		}) => {
			if (isScheduling) {
				setStartBlockSelection({
					zotDateIndex,
					blockIndex,
				});
				setEndBlockSelection({
					zotDateIndex,
					blockIndex,
				});
			} else {
				setIsMobileDrawerOpen(true);
				setSelectedZotDateIndex(zotDateIndex);
				setSelectedBlockIndex(blockIndex);
			}
		},
		[
			isScheduling,
			setIsMobileDrawerOpen,
			setSelectedZotDateIndex,
			setSelectedBlockIndex,
			setStartBlockSelection,
			setEndBlockSelection,
		],
	);

	const handleCellClick = useCallback(
		({
			zotDateIndex,
			blockIndex,
		}: {
			zotDateIndex: number;
			blockIndex: number;
		}) => {
			if (!isScheduling) {
				if (selectionIsLocked) {
					setSelectionIsLocked(false);
				} else {
					setSelectionIsLocked(true);
					updateSelection({ zotDateIndex, blockIndex });
				}
				return;
			}

			setStartBlockSelection({ zotDateIndex, blockIndex });
			setEndBlockSelection({ zotDateIndex, blockIndex });
		},
		[
			isScheduling,
			selectionIsLocked,
			setSelectionIsLocked,
			updateSelection,
			setStartBlockSelection,
			setEndBlockSelection,
		],
	);

	const handleCellHover = useCallback(
		({
			zotDateIndex,
			blockIndex,
		}: {
			zotDateIndex: number;
			blockIndex: number;
		}) => {
			toggleHoverGrid(true);

			if (isScheduling) {
				// In schedule mode, update end selection for drag
				if (startBlockSelection) {
					setEndBlockSelection({ zotDateIndex, blockIndex });
				}
			} else {
				if (!selectionIsLocked) {
					updateSelection({ zotDateIndex, blockIndex });
				}
			}
		},
		[
			isScheduling,
			selectionIsLocked,
			updateSelection,
			startBlockSelection,
			setEndBlockSelection,
			toggleHoverGrid,
		],
	);

	const handleMouseDown = useCallback(
		({
			zotDateIndex,
			blockIndex,
		}: {
			zotDateIndex: number;
			blockIndex: number;
		}) => {
			if (isScheduling) {
				setStartBlockSelection({ zotDateIndex, blockIndex });
				setEndBlockSelection({ zotDateIndex, blockIndex });
			}
		},
		[isScheduling, setStartBlockSelection, setEndBlockSelection],
	);

	const handleMouseMove = useCallback(
		({
			zotDateIndex,
			blockIndex,
		}: {
			zotDateIndex: number;
			blockIndex: number;
		}) => {
			if (isScheduling && startBlockSelection) {
				setEndBlockSelection({ zotDateIndex, blockIndex });
			}
		},
		[isScheduling, startBlockSelection, setEndBlockSelection],
	);

	const handleMouseUp = useCallback(() => {
		if (
			isScheduling &&
			startBlockSelection &&
			endBlockSelection &&
			selectionState
		) {
			const {
				earlierDateIndex,
				laterDateIndex,
				earlierBlockIndex,
				laterBlockIndex,
			} = selectionState;

			// get timestamps in the selected range
			const timestamps: string[] = [];
			for (
				let dateIndex = earlierDateIndex;
				dateIndex <= laterDateIndex;
				dateIndex++
			) {
				for (
					let blockIdx = earlierBlockIndex;
					blockIdx <= laterBlockIndex;
					blockIdx++
				) {
					const timestamp = getTimestampFromBlockIndex(
						blockIdx,
						dateIndex,
						fromTime,
						availabilityDates,
					);
					if (timestamp) {
						timestamps.push(timestamp);
					}
				}
			}

			// Each drag replaces the entire selection (clears any previous blocks)
			if (timestamps.length > 0) {
				replaceEntireSelection(timestamps);

				// Reset selection
				setStartBlockSelection(undefined);
				setEndBlockSelection(undefined);
				setSelectionState(undefined);
			}
		}
	}, [
		isScheduling,
		startBlockSelection,
		endBlockSelection,
		selectionState,
		fromTime,
		availabilityDates,
		replaceEntireSelection,
		setStartBlockSelection,
		setEndBlockSelection,
		setSelectionState,
	]);

	const handleTouchStart = (e: React.TouchEvent) => {
		if (!isScheduling) return;
		if (e.cancelable) {
			e.preventDefault();
		}

		const touch = e.touches[0];
		const element = document.elementFromPoint(touch.clientX, touch.clientY);

		if (!element) return;

		const zotDateIndex = parseInt(
			element.getAttribute("data-date-index") || "",
			10,
		);
		const blockIndex = parseInt(
			element.getAttribute("data-block-index") || "",
			10,
		);

		if (!Number.isNaN(zotDateIndex) && !Number.isNaN(blockIndex)) {
			setStartBlockSelection({ zotDateIndex, blockIndex });
			setEndBlockSelection({ zotDateIndex, blockIndex });
		}
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isScheduling) return;

		const touch = e.touches[0];
		const element = document.elementFromPoint(touch.clientX, touch.clientY);

		if (!element || !startBlockSelection) return;

		const zotDateIndex = parseInt(
			element.getAttribute("data-date-index") || "",
			10,
		);
		const blockIndex = parseInt(
			element.getAttribute("data-block-index") || "",
			10,
		);

		if (!Number.isNaN(zotDateIndex) && !Number.isNaN(blockIndex)) {
			setEndBlockSelection({ zotDateIndex, blockIndex });
		}
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (!isScheduling) return;
		if (e.cancelable) {
			e.preventDefault();
		}

		if (startBlockSelection && endBlockSelection && selectionState) {
			const {
				earlierDateIndex,
				laterDateIndex,
				earlierBlockIndex,
				laterBlockIndex,
			} = selectionState;

			const timestamps: string[] = [];
			for (
				let dateIndex = earlierDateIndex;
				dateIndex <= laterDateIndex;
				dateIndex++
			) {
				for (
					let blockIdx = earlierBlockIndex;
					blockIdx <= laterBlockIndex;
					blockIdx++
				) {
					const timestamp = getTimestampFromBlockIndex(
						blockIdx,
						dateIndex,
						fromTime,
						availabilityDates,
					);
					if (timestamp) timestamps.push(timestamp);
				}
			}

			if (timestamps.length > 0) {
				replaceEntireSelection(timestamps);

				setStartBlockSelection(undefined);
				setEndBlockSelection(undefined);
				setSelectionState(undefined);
			}
		}
	};

	const isTopOfHour = timeBlock % 60 === 0;
	const isHalfHour = timeBlock % 60 === 30;
	const isLastRow = blockIndex === availabilityTimeBlocks.length - 1;

	const spacers = spacerBeforeDate(currentPageAvailability);

	return currentPageAvailability.map((selectedDate, pageDateIndex) => {
		const key = generateDateKey({
			selectedDate,
			timeBlock,
			pageDateIndex,
		});

		if (selectedDate) {
			const zotDateIndex = pageDateIndex + currentPage * itemsPerPage;

			const isSelected =
				selectedZotDateIndex === zotDateIndex &&
				selectedBlockIndex === blockIndex;

			const timestamp = getTimestampFromBlockIndex(
				blockIndex,
				zotDateIndex,
				fromTime,
				availabilityDates,
			);

			const block = selectedDate.groupAvailability[timestamp] || [];
			const blockColor = isScheduled(timestamp)
				? "rgba(255, 215, 0, 0.6)" // gold
				: calculateBlockColor({
						block,
						hoveredMember,
						selectedMembers,
						numMembers,
						showBestTimes,
						maxAvailability,
					});

			const tableCellStyles = cn(
				isTopOfHour ? "border-t-[1px] border-t-gray-medium" : "",
				isHalfHour ? "border-t-[1px] border-t-gray-base" : "",
				isLastRow ? "border-b-[1px]" : "",
				isSelected && !isScheduling
					? "outline-dashed outline-2 outline-slate-500"
					: "",
			);

			return (
				<React.Fragment key={key}>
					{spacers[pageDateIndex] && (
						<td className="w-3 md:w-4" aria-hidden="true" />
					)}
					<td className="px-0 py-0">
						<GroupAvailabilityBlock
							className={cn(
								"group-availability-block block",
								isScheduling && "cursor-row-resize [touch-action:pinch-zoom]",
							)}
							onClick={() =>
								handleCellClick({
									zotDateIndex,
									blockIndex,
								})
							}
							onHover={() =>
								handleCellHover({
									zotDateIndex,
									blockIndex,
								})
							}
							blockColor={blockColor}
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
	});
}
