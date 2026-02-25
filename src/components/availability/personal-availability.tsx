"use client";

import { useEffect, useRef, useState } from "react";
import { AvailabilityBlocks } from "@/components/availability/table/availability-blocks";
import { useGoogleCalendar } from "@/hooks/use-google-calendar";
import type { GoogleCalendarEvent } from "@/lib/types/availability";
import type { ZotDate } from "@/lib/zotdate";

interface PersonalAvailabilityProps {
	timeBlock: number;
	blockIndex: number;
	availabilityTimeBlocks: number[];
	availabilityDates: ZotDate[];
	currentPageAvailability: ZotDate[];
	googleCalendarEvents: GoogleCalendarEvent[];
	meetingDates: string[];
}

export function PersonalAvailability({
	timeBlock,
	blockIndex,
	availabilityTimeBlocks,
	availabilityDates,
	currentPageAvailability,
	googleCalendarEvents,
	meetingDates,
}: PersonalAvailabilityProps) {
	const [isStateUnsaved, setIsStateUnsaved] = useState(false);
	const initialAvailabilityRef = useRef<string | null>(null);

	const { processedCellSegments } = useGoogleCalendar({
		googleCalendarEvents,
		currentPageAvailability,
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
			if (currentState !== initialAvailabilityRef.current) {
				setIsStateUnsaved(true);
			}
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
			availabilityTimeBlocksLength={availabilityTimeBlocks.length}
			currentPageAvailability={currentPageAvailability}
			processedCellSegments={processedCellSegments}
		/>
	);
}
