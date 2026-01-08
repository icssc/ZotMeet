"use client";

import { useEffect, useState } from "react";
import { getTimestampFromBlockIndex } from "@/components/availability/group-availability";
import { AvailabilityBlocks } from "@/components/availability/table/availability-blocks";
import { useGoogleCalendar } from "@/hooks/use-google-calendar";
import { UserProfile } from "@/lib/auth/user";
import type {
	AvailabilityBlockType,
	GoogleCalendarEvent,
} from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";
import { useBlockSelectionStore } from "@/store/useBlockSelectionStore";
import { useShallow } from "zustand/shallow";

interface PersonalAvailabilityProps {
	timeBlock: number;
	blockIndex: number;
	availabilityTimeBlocks: number[];
	fromTime: number;
	availabilityDates: ZotDate[];
	currentPageAvailability: ZotDate[];
	googleCalendarEvents: GoogleCalendarEvent[];
	user: UserProfile | null;
	onAvailabilityChange: (updatedDates: ZotDate[]) => void;
	meetingDates: string[];
}

export function PersonalAvailability({
	timeBlock,
	blockIndex,
	fromTime,
	availabilityTimeBlocks,
	availabilityDates,
	currentPageAvailability,
	googleCalendarEvents,
	user,
	onAvailabilityChange,
	meetingDates,
}: PersonalAvailabilityProps) {
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

	const [isEditingAvailability, setIsEditingAvailability] = useState(false);
	const [isStateUnsaved, setIsStateUnsaved] = useState(false);

	const { processedCellSegments } = useGoogleCalendar({
		googleCalendarEvents,
		currentPageAvailability,
		availabilityTimeBlocks,
		meetingDates,
	});

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

	const setAvailabilities = (startBlock: AvailabilityBlockType) => {
		if (!isEditingAvailability) {
			setIsEditingAvailability(true);
		}

		if (selectionState) {
			const {
				earlierDateIndex,
				laterDateIndex,
				earlierBlockIndex,
				laterBlockIndex,
			} = selectionState;

			const {
				zotDateIndex: selectionStartDateIndex,
				blockIndex: selectionStartBlockIndex,
			} = startBlock;

			const startSelectionZotDate = availabilityDates[selectionStartDateIndex];
			const selectionValue = !startSelectionZotDate.getBlockAvailability(
				selectionStartBlockIndex,
			);

			const updatedDates = [...availabilityDates];

			for (
				let dateIndex = earlierDateIndex;
				dateIndex <= laterDateIndex;
				dateIndex++
			) {
				const currentDate = updatedDates[dateIndex];
				currentDate.setBlockAvailabilities(
					earlierBlockIndex,
					laterBlockIndex,
					selectionValue,
				);

				// For each block in the selection range
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

					// Initialize empty array if timestamp doesn't exist
					if (!currentDate.groupAvailability[timestamp]) {
						currentDate.groupAvailability[timestamp] = [];
					}

					if (selectionValue) {
						// Add user to availability if not already present
						if (
							!currentDate.groupAvailability[timestamp].includes(
								user?.memberId ?? "",
							)
						) {
							currentDate.groupAvailability[timestamp].push(
								user?.memberId ?? "",
							);
						}
					} else {
						// Remove user from availability
						currentDate.groupAvailability[timestamp] =
							currentDate.groupAvailability[timestamp].filter(
								(id) => id !== (user?.memberId ?? ""),
							);
					}
				}
			}

			setStartBlockSelection(undefined);
			setEndBlockSelection(undefined);
			setSelectionState(undefined);
			setIsStateUnsaved(true);

			// Call the onAvailabilityChange handler with the updated dates
			onAvailabilityChange(updatedDates);
		}
	};

	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (isStateUnsaved) {
				event.preventDefault();
				event.returnValue =
					"Are you sure you want to leave? You have unsaved changes!";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [isStateUnsaved]);

	return (
		<AvailabilityBlocks
			setAvailabilities={setAvailabilities}
			timeBlock={timeBlock}
			blockIndex={blockIndex}
			availabilityTimeBlocksLength={availabilityTimeBlocks.length}
			currentPageAvailability={currentPageAvailability}
			processedCellSegments={processedCellSegments}
		/>
	);
}
