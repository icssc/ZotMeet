"use client";

import { fromZonedTime } from "date-fns-tz";
import React, { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { GroupAvailabilityBlock } from "@/components/availability/group-availability-block";
import {
	generateDateKey,
	newZonedPageAvailAndDates,
	spacerBeforeDate,
} from "@/lib/availability/utils";
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
	timezone: string,
	availabilityDates: ZotDate[],
) => {
	const totalMinutes = (fromTime % 1440) + blockIndex * 15;
	const dayOffset = Math.floor(totalMinutes / 1440);
	const minutesFromMidnight = totalMinutes % 1440;

	const hours = Math.floor(minutesFromMidnight / 60);
	const minutes = minutesFromMidnight % 60;

	const selectedDate = availabilityDates.at(zotDateIndex);

	if (!selectedDate) {
		return "";
	}
	const date = new Date(selectedDate.day);
	date.setHours(hours, minutes, 0, 0);
	date.setDate(date.getDate() + dayOffset);
	return fromZonedTime(date, timezone).toISOString();
};

function calculateBlockColor({
	availableBlock,
	ifNeededBlock,
	hoveredMember,
	selectedMembers,
	numMembers,
	showBestTimes,
	maxAvailability,
}: {
	availableBlock: string[];
	ifNeededBlock: string[];
	hoveredMember: string | null;
	selectedMembers: string[];
	numMembers: number;
	showBestTimes: boolean;
	maxAvailability: number;
}): string {
	const availableSet = new Set(availableBlock);
	const ifNeededSet = new Set(ifNeededBlock);

	// combined unique participants
	const combinedCount = new Set([...availableBlock, ...ifNeededBlock]).size;

	// Selected members mode: blend by how many selected are in each bucket
	if (selectedMembers.length) {
		let availHits = 0;
		let ifNeededHits = 0;

		for (const id of selectedMembers) {
			if (availableSet.has(id)) availHits++;
			else if (ifNeededSet.has(id)) ifNeededHits++;
		}

		if (availHits === 0 && ifNeededHits === 0) return "transparent";

		const availRatio = availHits / selectedMembers.length; // 0..1
		const ifNeededRatio = ifNeededHits / selectedMembers.length; // 0..1

		// Blend blue (55,124,251) + yellow (253,224,71)
		const r = Math.round(55 * availRatio + 253 * ifNeededRatio);
		const g = Math.round(124 * availRatio + 224 * ifNeededRatio);
		const b = Math.round(251 * availRatio + 71 * ifNeededRatio);

		// Opacity based on how many selected show up at all
		const opacity = (availHits + ifNeededHits) / selectedMembers.length;
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}

	// Hover mode: if-needed takes precedence over available for that member
	if (hoveredMember) {
		if (ifNeededSet.has(hoveredMember)) return "rgba(253, 224, 71, 0.85)";
		if (availableSet.has(hoveredMember)) return "rgba(55, 124, 251, 1)";
		return "transparent";
	}

	// Best times mode: highlight cells with the max combined participation
	if (showBestTimes) {
		if (combinedCount === maxAvailability && maxAvailability > 0) {
			// strong blue when it's a "best time"
			return "rgba(55, 124, 251, 1)";
		}
		return "transparent";
	}

	// Default: show two contributions (blue for available, yellow for if-needed)
	if (numMembers) {
		const availOpacity = availableBlock.length / numMembers; // 0..1
		const ifNeededOpacity = ifNeededBlock.length / numMembers; // 0..1

		// If there's only one type, use a single color
		if (availableBlock.length > 0 && ifNeededBlock.length === 0) {
			return `rgba(55, 124, 251, ${availOpacity})`;
		}
		if (ifNeededBlock.length > 0 && availableBlock.length === 0) {
			return `rgba(253, 224, 71, ${Math.min(0.9, ifNeededOpacity)})`;
		}

		// Mixed: blend base colors, opacity based on combined participation
		const totalOpacity = Math.min(1, combinedCount / numMembers);

		const availWeight = availOpacity / (availOpacity + ifNeededOpacity);
		const ifNeededWeight = 1 - availWeight;

		const r = Math.round(55 * availWeight + 253 * ifNeededWeight);
		const g = Math.round(124 * availWeight + 224 * ifNeededWeight);
		const b = Math.round(251 * availWeight + 71 * ifNeededWeight);

		return `rgba(${r}, ${g}, ${b}, ${totalOpacity})`;
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
	timezone: string;
	onMouseLeave: () => void;
	isScheduling: boolean;
	doesntNeedDay: boolean;
}

export function GroupAvailability({
	timeBlock,
	blockIndex,
	availabilityTimeBlocks,
	fromTime,
	availabilityDates,
	currentPageAvailability,
	members,
	timezone,
	onMouseLeave,
	isScheduling,
	doesntNeedDay,
}: GroupAvailabilityProps) {
	//extra day calculation for day spillover
	//put in here to prevent infinite adding, recalculates everytime something changes
	const [newBlocks, newAvailDates] = newZonedPageAvailAndDates(
		currentPageAvailability,
		availabilityDates,
		doesntNeedDay,
	);
	//counts number of days in availibilityTimeBlocks that is in the before (calculates the time offset for formatting)
	const datesBefore = React.useMemo(() => {
		if (availabilityTimeBlocks.length === 0) return 0;

		let count = 1;
		let prev = availabilityTimeBlocks[0];

		for (let i = 1; i < availabilityTimeBlocks.length; i++) {
			if (availabilityTimeBlocks[i] - prev !== 15) {
				break;
			}
			count++;
			prev = availabilityTimeBlocks[i];
		}

		return count;
	}, [availabilityTimeBlocks]);
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

	const { enabled: showBestTimes } = useBestTimesToggleStore();

	const maxAvailability = useMemo(() => {
		if (!showBestTimes || members.length === 0) return 0;

		let max = 0;
		availabilityDates.forEach((date) => {
			const keys = new Set<string>([
				...Object.keys(date.groupAvailability ?? {}),
				...Object.keys(date.groupIfNeededAvailability ?? {}),
			]);

			keys.forEach((ts) => {
				const available = date.groupAvailability?.[ts] || [];
				const ifNeeded = date.groupIfNeededAvailability?.[ts] || [];
				const combined = new Set([...available, ...ifNeeded]).size;
				max = Math.max(max, combined);
			});
		});

		return max;
	}, [showBestTimes, members.length, availabilityDates]);

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

	const { togglePendingTime, addPendingTimeRange, isScheduled } =
		useScheduleSelectionStore(
			useShallow((state) => ({
				togglePendingTime: state.togglePendingTime,
				addPendingTimeRange: state.addPendingTimeRange,
				isScheduled: state.isScheduled,
			})),
		);
	// to load scheduled time blocks when meeting is loaded
	// Forces re-render when scheduled or pending times change
	/*
	const scheduledSize = useScheduleSelectionStore(
		(state) => state.scheduledTimes.size,
	);
	const pendingSize = useScheduleSelectionStore(
		(state) => state.pendingAdds.size,
	);
*/
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
						timezone,
						newAvailDates,
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

				// if first timestamp is scheduled, we are un-scheduling the whole range
				if (isFirstScheduled) {
					timestamps.forEach((ts) => {
						if (isScheduled(ts)) {
							togglePendingTime(ts);
						}
					});
					// else we are scheduling the whole range
				} else {
					addPendingTimeRange(timestamps);
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
		newAvailDates,
		timezone,
		isScheduled,
		togglePendingTime,
		addPendingTimeRange,
		setStartBlockSelection,
		setEndBlockSelection,
		setSelectionState,
	]);

	const handleTouchStart = (e: React.TouchEvent) => {
		if (!isScheduling) {
			return;
		}
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
		if (!isScheduling) {
			return;
		}

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
						timezone,
						newAvailDates,
					);
					if (timestamp) timestamps.push(timestamp);
				}
			}

			if (timestamps.length > 0) {
				const firstTimestamp = timestamps[0];
				const isFirstScheduled = isScheduled(firstTimestamp);

				if (isFirstScheduled) {
					timestamps.forEach((ts) => {
						if (isScheduled(ts)) togglePendingTime(ts);
					});
				} else {
					addPendingTimeRange(timestamps);
				}

				setStartBlockSelection(undefined);
				setEndBlockSelection(undefined);
				setSelectionState(undefined);
			}
		}
	};

	const isTopOfHour = timeBlock % 60 === 0;
	const isHalfHour = timeBlock % 60 === 30;
	const isLastRow = blockIndex === availabilityTimeBlocks.length - 1;
	const numMembers = members.length;
	//ZotDate: contains day, availabilities
	const spacers = spacerBeforeDate(newBlocks);
	const totalMinutes = availabilityTimeBlocks[0] + blockIndex * 15;

	const dayOffset = Math.floor(totalMinutes / 1440);
	return newBlocks.map((selectedDate, pageDateIndex) => {
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
			//basically treating the table as 2 different tables, one for the "before time" and one for the after
			let timestamp = getTimestampFromBlockIndex(
				blockIndex,
				zotDateIndex,
				availabilityTimeBlocks[0],
				timezone,
				newAvailDates,
			);

			if (datesBefore !== 0 && blockIndex >= datesBefore) {
				timestamp = getTimestampFromBlockIndex(
					blockIndex - datesBefore,
					zotDateIndex,
					fromTime,
					timezone,
					newAvailDates,
				);
			}

			//similarly, block is recomputed to check the day before IF it crosses into the next day
			let effectiveAvailable =
				selectedDate.groupAvailability?.[timestamp] || [];
			let effectiveIfNeeded =
				selectedDate.groupIfNeededAvailability?.[timestamp] || [];

			// If spillover, pull from previous day
			if (
				datesBefore !== 0 &&
				blockIndex < datesBefore &&
				pageDateIndex !== 0 &&
				(!doesntNeedDay || dayOffset >= 1)
			) {
				effectiveAvailable =
					newBlocks[pageDateIndex - 1].groupAvailability?.[timestamp] || [];
				effectiveIfNeeded =
					newBlocks[pageDateIndex - 1].groupIfNeededAvailability?.[timestamp] ||
					[];
			}

			const blockColor = isScheduled(timestamp)
				? "rgba(255, 215, 0, 0.6)" // gold
				: calculateBlockColor({
						availableBlock: effectiveAvailable,
						ifNeededBlock: effectiveIfNeeded,
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
								isScheduling && "cursor-row-resize",
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
							onTouchStart={(e) => handleTouchStart(e)}
							onTouchMove={(e) => handleTouchMove(e)}
							onTouchEnd={(e) => handleTouchEnd(e)}
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
