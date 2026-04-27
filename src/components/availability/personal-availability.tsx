"use client";

import { useEffect, useRef, useState } from "react";
import type { GridCellHandlers } from "@/components/availability/table/availability-block-cell";
import { AvailabilityBlocks } from "@/components/availability/table/availability-blocks";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { useGoogleCalendar } from "@/hooks/use-google-calendar";
import type { PaintMode } from "@/lib/availability/paint-selection";
import type { GoogleCalendarEvent } from "@/lib/types/availability";
import type { ZotDate } from "@/lib/zotdate";

interface PersonalAvailabilityProps {
	availabilityTimeBlocks: number[];
	fromTimeMinutes: number;
	availabilityDates: ZotDate[];
	currentPageAvailability: {
		availabilities: ZotDate[];
		ifNeeded: ZotDate[];
	};
	googleCalendarEvents: GoogleCalendarEvent[];
	meetingDates: string[];
	userTimezone: string;
	handlers: Omit<GridCellHandlers, "onCellHover">;
	paintMode: PaintMode;
}

export function PersonalAvailability({
	availabilityTimeBlocks,
	fromTimeMinutes,
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
		currentPageAvailability: currentPageAvailability.availabilities,
		availabilityTimeBlocks,
		meetingDates,
	});

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
		<>
			{availabilityTimeBlocks.map((timeBlock, blockIndex) => (
				<tr key={`block-${timeBlock}`}>
					<AvailabilityTimeTicks timeBlock={timeBlock} />
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
						{...handlers}
					/>
				</tr>
			))}
		</>
	);
}
