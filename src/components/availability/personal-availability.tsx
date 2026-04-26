"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AvailabilityBlocks } from "@/components/availability/table/availability-blocks";
import { useGoogleCalendar } from "@/hooks/use-google-calendar";
import {
	type GridCell,
	useGridDragSelection,
} from "@/hooks/use-grid-drag-selection";
import type {
	GoogleCalendarEvent,
	SelectionStateType,
} from "@/lib/types/availability";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

interface PersonalAvailabilityProps {
	timeBlock: number;
	blockIndex: number;
	fromTimeMinutes: number;
	availabilityTimeBlocks: number[];
	availabilityDates: ZotDate[];
	currentPageAvailability: {
		availabilities: ZotDate[];
		ifNeeded: ZotDate[];
	};
	googleCalendarEvents: GoogleCalendarEvent[];
	meetingDates: string[];
	userTimezone: string;
	onCommitPersonal: (range: SelectionStateType, startCell: GridCell) => void;
}

export function PersonalAvailability({
	timeBlock,
	blockIndex,
	fromTimeMinutes,
	availabilityTimeBlocks,
	availabilityDates,
	currentPageAvailability,
	googleCalendarEvents,
	meetingDates,
	userTimezone,
	onCommitPersonal,
}: PersonalAvailabilityProps) {
	const [isStateUnsaved, setIsStateUnsaved] = useState(false);
	const initialAvailabilityRef = useRef<string | null>(null);

	const setSelectionState = useAvailabilityStore(
		(state) => state.setSelectionState,
	);

	const { processedCellSegments } = useGoogleCalendar({
		googleCalendarEvents,
		currentPageAvailability: currentPageAvailability["availabilities"],
		availabilityTimeBlocks,
		meetingDates,
	});

	// Store initial availability state on mount
	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run once on mount to capture initial state
	useEffect(() => {
		if (initialAvailabilityRef.current === null) {
			initialAvailabilityRef.current = JSON.stringify(
				availabilityDates.map((date) => date.availability),
			);
		}
	}, []);

	useEffect(() => {
		if (initialAvailabilityRef.current !== null) {
			const currentState = JSON.stringify(
				availabilityDates.map((date) => date.availability),
			);
			setIsStateUnsaved(currentState !== initialAvailabilityRef.current);
		}
	}, [availabilityDates]);

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

	const handlers = useGridDragSelection(
		useMemo(
			() => ({
				enabled: true,
				lockToStartRow: false,
				onDragUpdate: (range) => setSelectionState(range),
				onCommit: (range, { start }) => {
					onCommitPersonal(range, start);
				},
				onCancel: () => setSelectionState(undefined),
			}),
			[onCommitPersonal, setSelectionState],
		),
	);

	return (
		<AvailabilityBlocks
			timeBlock={timeBlock}
			blockIndex={blockIndex}
			fromTimeMinutes={fromTimeMinutes}
			availabilityDates={availabilityDates}
			availabilityTimeBlocksLength={availabilityTimeBlocks.length}
			currentPageAvailability={currentPageAvailability}
			processedCellSegments={processedCellSegments}
			timeZone={userTimezone}
			onPointerDown={handlers.onPointerDown}
			onPointerMove={handlers.onPointerMove}
			onPointerUp={handlers.onPointerUp}
			onPointerCancel={handlers.onPointerCancel}
			onKeyCommit={handlers.onKeyCommit}
		/>
	);
}
