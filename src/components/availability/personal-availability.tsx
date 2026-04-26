"use client";

import { useEffect, useRef, useState } from "react";
import type { GridCellHandlers } from "@/components/availability/table/availability-block-cell";
import { AvailabilityBlocks } from "@/components/availability/table/availability-blocks";
import { useGoogleCalendar } from "@/hooks/use-google-calendar";
import type { PaintMode } from "@/lib/availability/paint-selection";
import type { GoogleCalendarEvent } from "@/lib/types/availability";
import type { ZotDate } from "@/lib/zotdate";

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
	handlers: GridCellHandlers;
	paintMode: PaintMode;
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
	handlers,
	paintMode,
}: PersonalAvailabilityProps) {
	const [isStateUnsaved, setIsStateUnsaved] = useState(false);
	const initialAvailabilityRef = useRef<string | null>(null);

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
			paintMode={paintMode}
			onPointerDown={handlers.onPointerDown}
			onPointerMove={handlers.onPointerMove}
			onPointerUp={handlers.onPointerUp}
			onPointerCancel={handlers.onPointerCancel}
			onKeyDown={handlers.onKeyDown}
		/>
	);
}
