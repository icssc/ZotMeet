"use client";


import { fromZonedTime, toZonedTime } from "date-fns-tz";
import React, { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { GroupAvailabilityBlock } from "@/components/availability/group-availability-block";
import { generateDateKey, spacerBeforeDate } from "@/lib/availability/utils";
import type { Member } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";
import { useGroupSelectionStore } from "@/store/useGroupSelectionStore";

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

interface GroupAvailabilityProps {
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
	//TODO: redo the calculation on the doesntNeedDay to incorporate day

	const newBlocks = structuredClone(currentPageAvailability);
	let dayIndex = currentPageAvailability.length - 1;
	const newAvailDates = structuredClone(availabilityDates);
	while (currentPageAvailability[dayIndex] == null) {
		dayIndex -= 1;
	}
	if (!doesntNeedDay) {
		const prevDay = currentPageAvailability[dayIndex];
		//console.log(currentPageAvailability);
		const newDay = new Date(prevDay.day);
		newDay.setDate(newDay.getDate() + 1);
		newBlocks[dayIndex + 1] = new ZotDate(
			newDay,
			prevDay.earliestTime,
			prevDay.latestTime,
			false,
			[],
			{},
		);

		newAvailDates.push(
			new ZotDate(
				newDay,
				prevDay.earliestTime,
				prevDay.latestTime,
				false,
				[],
				{},
			),
		);
	}

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
			if (!selectionIsLocked) {
				updateSelection({ zotDateIndex, blockIndex });
			}
		},
		[selectionIsLocked, updateSelection],
	);

	const isTopOfHour = timeBlock % 60 === 0;
	const isHalfHour = timeBlock % 60 === 30;
	const isLastRow = blockIndex === availabilityTimeBlocks.length - 1;
	const numMembers = members.length;
	//console.log(currentPageAvailability);
	//ZotDate: contains day, availabilities
	const spacers = spacerBeforeDate(newBlocks);
	//console.log(currentPageAvailability)
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
					availabilityDates,
				);
			}

			//similarly, block is recomputed to check the day before IF it crosses into the next day
			let block = selectedDate.groupAvailability[timestamp] || [];

			if (
				datesBefore !== 0 &&
				blockIndex < datesBefore &&
				pageDateIndex - 1 >= 0
			) {
				block = newBlocks[pageDateIndex - 1].groupAvailability[timestamp] || [];
			}

			// Get the block (array of member IDs available at this timestamp)

			// Calculate block color
			let blockColor = "transparent";
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
