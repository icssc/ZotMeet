"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";
import { GroupAvailabilityBlock } from "@/components/availability/group-availability-block";
import { generateDateKey, spacerBeforeDate } from "@/lib/availability/utils";
import type { Member } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";
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
		setSelectedZotDateIndex,
		setSelectedBlockIndex,
		setSelectionIsLocked,
		setIsMobileDrawerOpen,
	} = useGroupSelectionStore(
		useShallow((state) => ({
			selectedZotDateIndex: state.selectedZotDateIndex,
			selectedBlockIndex: state.selectedBlockIndex,
			selectionIsLocked: state.selectionIsLocked,
			hoveredMember: state.hoveredMember,
			setSelectedZotDateIndex: state.setSelectedZotDateIndex,
			setSelectedBlockIndex: state.setSelectedBlockIndex,
			setSelectionIsLocked: state.setSelectionIsLocked,
			setIsMobileDrawerOpen: state.setIsMobileDrawerOpen,
		})),
	);

	const {
		startBlockSelection,
		endBlockSelection,
		selectionState,
		setStartBlockSelection,
		setEndBlockSelection,
		setSelectionState,
	} = useBlockSelectionStore(
		useShallow((state) => ({
			startBlockSelection: state.startBlockSelection,
			endBlockSelection: state.endBlockSelection,
			selectionState: state.selectionState,
			setStartBlockSelection: state.setStartBlockSelection,
			setEndBlockSelection: state.setEndBlockSelection,
			setSelectionState: state.setSelectionState,
		})),
	);

	const { toggleScheduledTime, addScheduledTimeRange, isScheduled } =
		useScheduleSelectionStore(
			useShallow((state) => ({
				toggleScheduledTime: state.toggleScheduledTime,
				addScheduledTimeRange: state.addScheduledTimeRange,
				isScheduled: state.isScheduled,
			})),
		);

	// Track if we're dragging to prevent onClick from firing after drag
	const isDraggingRef = useRef(false);

	// update start and end block selection state
	useEffect(() => {
		if (startBlockSelection && endBlockSelection) {
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
			isSelected,
			zotDateIndex,
			blockIndex,
		}: {
			isSelected: boolean;
			zotDateIndex: number;
			blockIndex: number;
		}) => {
			console.log("handling click");
			// Don't handle click if we just finished a drag
			if (isDraggingRef.current) {
				isDraggingRef.current = false;
				return;
			}

			if (isScheduling) {
				console.log("isScheduling");
				const timestamp = getTimestampFromBlockIndex(
					blockIndex,
					zotDateIndex,
					fromTime,
					availabilityDates,
				);
				console.log(timestamp);
				if (timestamp) {
					toggleScheduledTime(timestamp);
					console.log("toggled off timestamp");
				}
			} else {
				if (selectionIsLocked && isSelected) {
					setSelectionIsLocked(false);
				} else {
					setSelectionIsLocked(true);
					updateSelection({ zotDateIndex, blockIndex });
				}
			}
		},
		[
			isScheduling,
			selectionIsLocked,
			setSelectionIsLocked,
			updateSelection,
			fromTime,
			availabilityDates,
			toggleScheduledTime,
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
				isDraggingRef.current = false;
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
				isDraggingRef.current = true;
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

			// Toggle all timestamps in range
			if (timestamps.length > 0) {
				const firstTimestamp = timestamps[0];
				const isFirstScheduled = isScheduled(firstTimestamp);

				// If first is scheduled, remove all; otherwise add all
				if (isFirstScheduled) {
					timestamps.forEach((ts) => {
						if (isScheduled(ts)) {
							toggleScheduledTime(ts);
						}
					});
				} else {
					addScheduledTimeRange(timestamps);
				}

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
		isScheduled,
		toggleScheduledTime,
		addScheduledTimeRange,
		setStartBlockSelection,
		setEndBlockSelection,
		setSelectionState,
	]);

	const isTopOfHour = timeBlock % 60 === 0;
	const isHalfHour = timeBlock % 60 === 30;
	const isLastRow = blockIndex === availabilityTimeBlocks.length - 1;
	const numMembers = members.length;

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

			// Get the block (array of member IDs available at this timestamp)
			const block = selectedDate.groupAvailability[timestamp] || [];

			// Check if this block is scheduled
			const blockIsScheduled =
				isScheduling && timestamp !== "" && isScheduled(timestamp);

			// Calculate block color
			let blockColor = "transparent";

			if (blockIsScheduled) {
				blockColor = "rgba(255, 215, 0, 0.6)"; // gold
			} else {
				// use the blue heatmap based on group availability.
				if (hoveredMember) {
					if (block.includes(hoveredMember)) {
						blockColor = "rgba(55, 124, 251)";
					} else {
						blockColor = "transparent";
					}
				} else if (numMembers > 0) {
					const opacity = block.length / numMembers;
					blockColor = `rgba(55, 124, 251, ${opacity})`;
				}
			}

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
								isScheduling && "cursor-row-resize",
							)}
							onClick={() =>
								handleCellClick({
									isSelected,
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
							onMouseDown={() =>
								handleMouseDown({
									zotDateIndex,
									blockIndex,
								})
							}
							onMouseMove={() =>
								handleMouseMove({
									zotDateIndex,
									blockIndex,
								})
							}
							onMouseUp={handleMouseUp}
							block={block}
							blockColor={blockColor}
							tableCellStyles={tableCellStyles}
							hoveredMember={hoveredMember}
							hasSpacerBefore={spacers[pageDateIndex]}
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
