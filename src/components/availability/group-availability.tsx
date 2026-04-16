"use client";

import { alpha, useTheme } from "@mui/material/styles";
import React, { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { GroupAvailabilityBlock } from "@/components/availability/group-availability-block";

import {
	generateDateKey,
	getTimestampFromBlockIndex,
	spacerBeforeDate,
} from "@/lib/availability/utils";
import type { Member } from "@/lib/types/availability";
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
			return alpha(primaryColor, 1);
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

function formatScheduledTimeRange(timestamps: string[]): string {
	if (timestamps.length === 0) return "";
	const sorted = [...timestamps].sort();
	const start = new Date(sorted[0]);
	const last = new Date(sorted[sorted.length - 1]);
	last.setMinutes(last.getMinutes() + 15);

	const fmt = (d: Date) => {
		const h = d.getHours();
		const m = d.getMinutes();
		const ampm = h >= 12 ? "PM" : "AM";
		const hour = h % 12 || 12;
		return m === 0
			? `${hour}${ampm}`
			: `${hour}:${String(m).padStart(2, "0")}${ampm}`;
	};
	return `${fmt(start)} - ${fmt(last)}`;
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
}: GroupAvailabilityProps) {
	const theme = useTheme();
	const { currentPage, itemsPerPage } = useAvailabilityStore(
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
	} = useAvailabilityStore(
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

	const {
		startBlockSelection,
		endBlockSelection,
		setStartBlockSelection,
		setEndBlockSelection,
		setSelectionState,
	} = useAvailabilityStore(
		useShallow((state) => ({
			startBlockSelection: state.startBlockSelection,
			endBlockSelection: state.endBlockSelection,
			setStartBlockSelection: state.setStartBlockSelection,
			setEndBlockSelection: state.setEndBlockSelection,
			setSelectionState: state.setSelectionState,
		})),
	);

	const { replaceEntireSelection, isScheduled } = useAvailabilityStore(
		useShallow((state) => ({
			replaceEntireSelection: state.replaceEntireSelection,
			isScheduled: state.isScheduled,
		})),
	);
	// to load scheduled time blocks when meeting is loaded
	// Forces re-render when scheduled or pending times change

	useAvailabilityStore((state) => state.scheduledTimes.size);
	useAvailabilityStore((state) => state.pendingAdds.size);

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
				// In schedule mode, keep the drag on the start day (same row index = time slot).
				if (startBlockSelection) {
					setEndBlockSelection({
						zotDateIndex: startBlockSelection.zotDateIndex,
						blockIndex,
					});
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
				setEndBlockSelection({
					zotDateIndex: startBlockSelection.zotDateIndex,
					blockIndex,
				});
			}
		},
		[isScheduling, startBlockSelection, setEndBlockSelection],
	);

	const handleMouseUp = useCallback(() => {
		if (isScheduling && startBlockSelection && endBlockSelection) {
			const day = startBlockSelection.zotDateIndex;
			const earlierBlockIndex = Math.min(
				startBlockSelection.blockIndex,
				endBlockSelection.blockIndex,
			);
			const laterBlockIndex = Math.max(
				startBlockSelection.blockIndex,
				endBlockSelection.blockIndex,
			);

			const timestamps: string[] = [];
			for (
				let blockIdx = earlierBlockIndex;
				blockIdx <= laterBlockIndex;
				blockIdx++
			) {
				const timestamp = getTimestampFromBlockIndex(
					blockIdx,
					day,
					fromTime,
					availabilityDates,
					timeZone,
				);
				if (timestamp) {
					timestamps.push(timestamp);
				}
			}

			// Each drag replaces the full scheduled selection (one rectangle; prior slots cleared)
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
		fromTime,
		availabilityDates,
		timeZone,
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
			setEndBlockSelection({
				zotDateIndex: startBlockSelection.zotDateIndex,
				blockIndex,
			});
		}
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (!isScheduling) return;
		if (e.cancelable) {
			e.preventDefault();
		}

		if (startBlockSelection && endBlockSelection) {
			const day = startBlockSelection.zotDateIndex;
			const earlierBlockIndex = Math.min(
				startBlockSelection.blockIndex,
				endBlockSelection.blockIndex,
			);
			const laterBlockIndex = Math.max(
				startBlockSelection.blockIndex,
				endBlockSelection.blockIndex,
			);

			const timestamps: string[] = [];
			for (
				let blockIdx = earlierBlockIndex;
				blockIdx <= laterBlockIndex;
				blockIdx++
			) {
				const timestamp = getTimestampFromBlockIndex(
					blockIdx,
					day,
					fromTime,
					availabilityDates,
					timeZone,
				);
				if (timestamp) timestamps.push(timestamp);
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

				const isSelected =
					selectedZotDateIndex === zotDateIndex &&
					selectedBlockIndex === blockIndex;

				const timestamp = getTimestampFromBlockIndex(
					blockIndex,
					zotDateIndex,
					fromTime,
					availabilityDates,
					timeZone,
				);

<<<<<<< HEAD
				const block = selectedDate.groupAvailability[timestamp] || [];
				const ifNeededBlock = ifNeededDate?.groupAvailability[timestamp] || [];
				//console.log(ifNeededBlock, block)
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
							)
						: "";
				const nextTimestamp =
					blockIndex < availabilityTimeBlocks.length - 1
						? getTimestampFromBlockIndex(
								blockIndex + 1,
								zotDateIndex,
								fromTime,
								availabilityDates,
							)
						: "";
				const isTopEdge =
					blockIsScheduled && (!prevTimestamp || !isScheduled(prevTimestamp));
				const isBottomEdge =
					blockIsScheduled && (!nextTimestamp || !isScheduled(nextTimestamp));
=======
			const block = selectedDate.groupAvailability[timestamp] || [];
			const ifNeededBlock = ifNeededDate?.groupAvailability[timestamp] || [];
			//console.log(ifNeededBlock, block)
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
						)
					: "";
			const nextTimestamp =
				blockIndex < availabilityTimeBlocks.length - 1
					? getTimestampFromBlockIndex(
							blockIndex + 1,
							zotDateIndex,
							fromTime,
							availabilityDates,
						)
					: "";
			const isTopEdge =
				blockIsScheduled && (!prevTimestamp || !isScheduled(prevTimestamp));
			const isBottomEdge =
				blockIsScheduled && (!nextTimestamp || !isScheduled(nextTimestamp));
>>>>>>> 3113d6142 (chore: 🔧 apply styling to scheduled meeting block)

				const tableCellStyles = cn(
					isTopOfHour ? "border-t-[1px] border-t-gray-medium" : "",
					isHalfHour ? "border-t-[1px] border-t-gray-base" : "",
					isLastRow ? "border-b-[1px]" : "",
					isSelected && !isScheduling
						? "outline-dashed outline-2 outline-slate-500"
						: "",
				);

<<<<<<< HEAD
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
=======
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
							isScheduled={blockIsScheduled}
							isScheduledTopEdge={isTopEdge}
							isScheduledBottomEdge={isBottomEdge}
							scheduledMeetingTitle={isTopEdge ? meetingTitle : undefined}
							scheduledTimeRange={isTopEdge ? scheduledTimeRange : undefined}
							scheduledBlockCount={isTopEdge ? scheduledBlockCount : undefined}
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
>>>>>>> 1238eeb86 (chore: 🔧 apply styling to scheduled meeting block)
}
