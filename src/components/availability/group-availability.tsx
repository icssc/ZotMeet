"use client";

import React, { useCallback, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { GroupAvailabilityBlock } from "@/components/availability/group-availability-block";
import { generateDateKey, spacerBeforeDate } from "@/lib/availability/utils";
import type { Member } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";
import { useBestTimesToggleStore } from "@/store/useBestTimesToggleStore";
import { useGroupSelectionStore } from "@/store/useGroupSelectionStore";

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
	timeBlock: number;
	blockIndex: number;
	availabilityTimeBlocks: number[];
	fromTime: number;
	availabilityDates: ZotDate[];
	currentPageAvailability: ZotDate[];
	members: Member[];
	onMouseLeave: () => void;
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

	const updateSelection = useCallback(
		({
			zotDateIndex,
			blockIndex,
		}: {
			zotDateIndex: number;
			blockIndex: number;
		}) => {
			setIsMobileDrawerOpen(true);
			setSelectedZotDateIndex(zotDateIndex);
			setSelectedBlockIndex(blockIndex);
		},
		[setIsMobileDrawerOpen, setSelectedZotDateIndex, setSelectedBlockIndex],
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
			if (selectionIsLocked && isSelected) {
				setSelectionIsLocked(false);
			} else {
				setSelectionIsLocked(true);
				updateSelection({ zotDateIndex, blockIndex });
			}
		},
		[selectionIsLocked, setSelectionIsLocked, updateSelection],
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

			if (!selectionIsLocked) {
				updateSelection({ zotDateIndex, blockIndex });
			}
		},
		[toggleHoverGrid, selectionIsLocked, updateSelection],
	);

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

			const blockColor = calculateBlockColor({
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
				isSelected ? "outline-dashed outline-2 outline-slate-500" : "",
			);

			return (
				<React.Fragment key={key}>
					{spacers[pageDateIndex] && (
						<td className="w-3 md:w-4" aria-hidden="true" />
					)}
					<td className="px-0 py-0">
						<GroupAvailabilityBlock
							className="group-availability-block block"
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
							blockColor={blockColor}
							tableCellStyles={tableCellStyles}
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
