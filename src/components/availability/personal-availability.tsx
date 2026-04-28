"use client";

import { useEffect } from "react";
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
		availabilities: (ZotDate | null)[];
		ifNeeded: (ZotDate | null)[];
	};
	googleCalendarEvents: GoogleCalendarEvent[];
	meetingDates: string[];
	userTimezone: string;
	handlers: Omit<GridCellHandlers, "onCellHover">;
	paintMode: PaintMode;
	isDirty: boolean;
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
	isDirty,
}: PersonalAvailabilityProps) {
	const { processedCellSegments } = useGoogleCalendar({
		googleCalendarEvents,
		currentPageAvailability: currentPageAvailability.availabilities,
		availabilityTimeBlocks,
		meetingDates,
	});

	useEffect(() => {
		if (!isDirty) return;
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault();
			event.returnValue =
				"Are you sure you want to leave? You have unsaved changes!";
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [isDirty]);

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
