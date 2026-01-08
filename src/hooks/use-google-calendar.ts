import { useMemo } from "react";
import { useShallow } from "zustand/shallow";
import {
	generateCellKey,
	getDatePart,
	getMinutesFromMidnight,
} from "@/lib/availability/utils";
import type {
	EventSegment,
	GoogleCalendarEvent,
	GoogleCalendarEventLayoutInfo,
	ProcessedCellEventSegments,
} from "@/lib/types/availability";
import { isAnchorDateMeeting } from "@/lib/types/chrono";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";

interface UseGoogleCalendarProps {
	googleCalendarEvents: GoogleCalendarEvent[];
	currentPageAvailability: ZotDate[];
	availabilityTimeBlocks: number[];
	meetingDates: string[];
}

export function useGoogleCalendar({
	googleCalendarEvents,
	currentPageAvailability,
	availabilityTimeBlocks,
	meetingDates,
}: UseGoogleCalendarProps) {
	const { currentPage, itemsPerPage } = useAvailabilityPaginationStore(
		useShallow((state) => ({
			currentPage: state.currentPage,
			itemsPerPage: state.itemsPerPage,
		})),
	);
	const isAnchorMeeting = isAnchorDateMeeting(meetingDates);

	const processedCellSegments = useMemo((): ProcessedCellEventSegments => {
		const segmentsMap = new Map<string, EventSegment[]>();
		if (
			!googleCalendarEvents ||
			googleCalendarEvents.length === 0 ||
			currentPageAvailability.length === 0
		) {
			return segmentsMap;
		}

		const eventsByDate = processEventsByDate(
			googleCalendarEvents,
			currentPageAvailability,
			isAnchorMeeting,
		);
		const eventsWithLayout = calculateEventLayout(eventsByDate);
		return createCellSegments(
			eventsWithLayout,
			currentPageAvailability,
			availabilityTimeBlocks,
			currentPage,
			itemsPerPage,
		);
	}, [
		googleCalendarEvents,
		currentPageAvailability,
		availabilityTimeBlocks,
		currentPage,
		itemsPerPage,
		isAnchorMeeting,
	]);

	return { processedCellSegments };
}

function processEventsByDate(
	events: GoogleCalendarEvent[],
	currentPageAvailability: ZotDate[],
	isAnchorMeeting: boolean,
): Map<string, GoogleCalendarEventLayoutInfo[]> {
	const eventsByDate = new Map<string, GoogleCalendarEventLayoutInfo[]>();

	for (const event of events) {
		if (!event.start?.includes("T") || !event.end?.includes("T")) {
			continue;
		}

		const eventDateStr = getDatePart(event.start);
		const eventDayOfWeek = new Date(event.start).getDay();
		const zotDateForEvent = currentPageAvailability.find((zd) => {
			if (!zd) return false;
			if (isAnchorMeeting) {
				return zd.day.getDay() === eventDayOfWeek;
			} else {
				return getDatePart(zd.day.toISOString()) === eventDateStr;
			}
		});

		if (!zotDateForEvent) {
			continue;
		}
		const keyDateStr = getDatePart(zotDateForEvent.day.toISOString());

		const originalStartMins = getMinutesFromMidnight(event.start);
		const originalEndMins = getMinutesFromMidnight(event.end);

		const clampedStart = Math.max(
			originalStartMins,
			zotDateForEvent.earliestTime,
		);
		const clampedEnd = Math.min(originalEndMins, zotDateForEvent.latestTime);

		if (clampedEnd <= clampedStart) {
			continue;
		}

		const startBlock = Math.floor(
			(clampedStart - zotDateForEvent.earliestTime) /
				zotDateForEvent.blockLength,
		);
		const endBlock =
			Math.ceil(
				(clampedEnd - zotDateForEvent.earliestTime) /
					zotDateForEvent.blockLength,
			) - 1;

		if (endBlock < startBlock) {
			continue;
		}

		const layoutInfo: GoogleCalendarEventLayoutInfo = {
			id: event.id,
			summary: event.summary,
			originalStartMinutes: originalStartMins,
			originalEndMinutes: originalEndMins,
			clampedStartMinutes: clampedStart,
			clampedEndMinutes: clampedEnd,
			assignedColumn: 0,
			gridColumnCount: 1, // Represents number of events that will share same cell (isolated cell doesn't know in case of staggered events)
			startDateString: keyDateStr,
			startBlockIndex: startBlock,
			endBlockIndex: endBlock,
			calendarColor: event.calendarColor,
		};

		if (!eventsByDate.has(keyDateStr)) {
			eventsByDate.set(keyDateStr, []);
		}
		const eventsForDate = eventsByDate.get(keyDateStr);
		if (!eventsForDate) {
			continue;
		}
		eventsForDate.push(layoutInfo);
	}

	return eventsByDate;
}

function calculateEventLayout(
	eventsByDate: Map<string, GoogleCalendarEventLayoutInfo[]>,
): Map<string, GoogleCalendarEventLayoutInfo[]> {
	eventsByDate.forEach((eventsForDay) => {
		if (eventsForDay.length === 0) {
			return;
		}

		// Sort events by start time and duration
		eventsForDay.sort(
			(a, b) =>
				a.clampedStartMinutes - b.clampedStartMinutes ||
				b.clampedEndMinutes -
					b.originalStartMinutes -
					(a.clampedEndMinutes - a.originalStartMinutes),
		);

		// Assign columns to events
		// TODO: Optimize algorithm, currently greedy algorithm approach (n^2)
		const columns: GoogleCalendarEventLayoutInfo[][] = [];
		for (const event of eventsForDay) {
			let placed = false;
			for (let i = 0; i < columns.length; i++) {
				const lastEventInCol = columns[i][columns[i].length - 1];
				if (event.clampedStartMinutes >= lastEventInCol.clampedEndMinutes) {
					event.assignedColumn = i;
					columns[i].push(event);
					placed = true;
					break;
				}
			}
			if (!placed) {
				event.assignedColumn = columns.length;
				columns.push([event]);
			}
		}

		// Calculate gridColumnCount
		// TODO: Optimize algorithm, currently greedy algorithm approach (n^2)
		for (const event of eventsForDay) {
			let currentGridColumnCount = 0;
			for (const otherEvent of eventsForDay) {
				const startsBeforeOtherEnds =
					event.clampedStartMinutes < otherEvent.clampedEndMinutes;
				const endsAfterOtherStarts =
					event.clampedEndMinutes > otherEvent.clampedStartMinutes;
				if (startsBeforeOtherEnds && endsAfterOtherStarts) {
					currentGridColumnCount = Math.max(
						currentGridColumnCount,
						otherEvent.assignedColumn + 1,
					);
				}
			}
			event.gridColumnCount = Math.max(1, currentGridColumnCount);
		}

		// Propagate gridColumnCount among overlapping events
		// TODO: Optimize algorithm, currently greedy algorithm approach (n^2)
		for (const event of eventsForDay) {
			let groupSharedGridColumnCount = event.gridColumnCount;
			for (const otherEvent of eventsForDay) {
				if (event.id === otherEvent.id) continue;
				const startsBeforeOtherEnds =
					event.clampedStartMinutes < otherEvent.clampedEndMinutes;
				const endsAfterOtherStarts =
					event.clampedEndMinutes > otherEvent.clampedStartMinutes;
				if (startsBeforeOtherEnds && endsAfterOtherStarts) {
					groupSharedGridColumnCount = Math.max(
						groupSharedGridColumnCount,
						otherEvent.gridColumnCount,
					);
				}
			}
			event.gridColumnCount = groupSharedGridColumnCount;
		}
	});

	return eventsByDate;
}

function createCellSegments(
	eventsByDate: Map<string, GoogleCalendarEventLayoutInfo[]>,
	currentPageAvailability: ZotDate[],
	availabilityTimeBlocks: number[],
	currentPage: number,
	itemsPerPage: number,
): ProcessedCellEventSegments {
	const segmentsMap: ProcessedCellEventSegments = new Map();

	currentPageAvailability.forEach((zotDate, pageDateIndex) => {
		if (!zotDate) return;

		const zotDateIndex = pageDateIndex + currentPage * itemsPerPage;
		const currentDateStr = getDatePart(zotDate.day.toISOString());
		const eventsToLayout = eventsByDate.get(currentDateStr) || [];

		eventsToLayout.forEach((event) => {
			for (
				let blockIdx = event.startBlockIndex;
				blockIdx <= event.endBlockIndex;
				blockIdx++
			) {
				if (blockIdx < 0 || blockIdx >= availabilityTimeBlocks.length) {
					continue;
				}

				const cellKey = generateCellKey(zotDateIndex, blockIdx);
				if (!segmentsMap.has(cellKey)) {
					segmentsMap.set(cellKey, []);
				}

				const segment: EventSegment = {
					eventId: event.id,
					summary: event.summary,
					layoutInfo: structuredClone(event),
					isStartOfEventInCell: blockIdx === event.startBlockIndex,
					isEndOfEventInCell: blockIdx === event.endBlockIndex,
					cellAssignedColumn: event.assignedColumn,
					cellGridColumnCount: event.gridColumnCount,
					calendarColor: event.calendarColor,
				};
				const segmentsForCell = segmentsMap.get(cellKey);
				if (!segmentsForCell) {
					continue;
				}
				segmentsForCell.push(segment);
			}
		});
	});

	return segmentsMap;
}
