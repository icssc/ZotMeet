"use client";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { getTimestampFromBlockIndex } from "@/components/availability/group-availability";
import { AvailabilityBlocks } from "@/components/availability/table/availability-blocks";
import { useGoogleCalendar } from "@/hooks/use-google-calendar";
import type { UserProfile } from "@/lib/auth/user";
import type {
	AvailabilityBlockType,
	GoogleCalendarEvent,
} from "@/lib/types/availability";
import type { AvailabilityType, ZotDate } from "@/lib/zotdate";
import { useBlockSelectionStore } from "@/store/useBlockSelectionStore";

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
	timezone: string;
	meetingDates: string[];
	availabilityMode: AvailabilityType;
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
	timezone,
	meetingDates,
	availabilityMode,
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

		if (!selectionState) {
			return;
		}

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
			availabilityMode,
		);

		const updatedDates = availabilityDates.map((d) => d.clone());

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
				availabilityMode,
			);

			if (availabilityMode === "availability") {
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
						availabilityDates,
					);

					const existing = currentDate.groupAvailability[timestamp] ?? [];

					if (selectionValue) {
						if (!existing.includes(user?.memberId ?? "")) {
							currentDate.groupAvailability[timestamp] = [
								...existing,
								user?.memberId ?? "",
							];
						} else {
							currentDate.groupAvailability[timestamp] = existing;
						}
					} else {
						currentDate.groupAvailability[timestamp] = existing.filter(
							(id) => id !== (user?.memberId ?? ""),
						);
					}
				}
			}
		}

		setStartBlockSelection(undefined);
		setEndBlockSelection(undefined);
		setSelectionState(undefined);
		setIsStateUnsaved(true);

		onAvailabilityChange(updatedDates);
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
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [isStateUnsaved]);

	return (
		<AvailabilityBlocks
			setAvailabilities={setAvailabilities}
			timeBlock={timeBlock}
			blockIndex={blockIndex}
			availabilityTimeBlocksLength={availabilityTimeBlocks.length}
			currentPageAvailability={currentPageAvailability}
			processedCellSegments={processedCellSegments}
			availabilityKind={availabilityMode}
		/>
	);
}
