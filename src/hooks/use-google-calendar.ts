import { useMemo } from "react";
import { getDatePart, getMinutesFromMidnight } from "@/lib/availability/utils";
import type {
    EventSegment,
    GoogleCalendarEvent,
    GoogleCalendarEventLayoutInfo,
    ProcessedCellEventSegments,
} from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";

interface UseGoogleCalendarProps {
    googleCalendarEvents: GoogleCalendarEvent[];
    currentPageAvailability: ZotDate[];
    availabilityTimeBlocks: number[];
    currentPage: number;
    itemsPerPage: number;
}

export function useGoogleCalendar({
    googleCalendarEvents,
    currentPageAvailability,
    availabilityTimeBlocks,
    currentPage,
    itemsPerPage,
}: UseGoogleCalendarProps) {
    const processedCellSegments = useMemo((): ProcessedCellEventSegments => {
        const segmentsMap: ProcessedCellEventSegments = new Map();
        if (
            !googleCalendarEvents ||
            googleCalendarEvents.length === 0 ||
            currentPageAvailability.length === 0
        ) {
            return segmentsMap;
        }

        const eventsByDate = processEventsByDate(
            googleCalendarEvents,
            currentPageAvailability
        );
        const eventsWithLayout = calculateEventLayout(eventsByDate);
        return createCellSegments(
            eventsWithLayout,
            currentPageAvailability,
            currentPage,
            itemsPerPage,
            availabilityTimeBlocks
        );
    }, [
        googleCalendarEvents,
        currentPageAvailability,
        availabilityTimeBlocks,
        currentPage,
        itemsPerPage,
    ]);

    return { processedCellSegments };
}

function processEventsByDate(
    events: GoogleCalendarEvent[],
    currentPageAvailability: ZotDate[]
): Map<string, GoogleCalendarEventLayoutInfo[]> {
    const eventsByDate = new Map<string, GoogleCalendarEventLayoutInfo[]>();

    for (const event of events) {
        if (!event.start?.includes("T") || !event.end?.includes("T")) {
            continue;
        }

        const currentDateStr = getDatePart(event.start);
        const zotDateForEvent = currentPageAvailability.find(
            (zd) => zd && getDatePart(zd.day.toISOString()) === currentDateStr
        );

        if (!zotDateForEvent) {
            continue;
        }

        const originalStartMins = getMinutesFromMidnight(event.start);
        const originalEndMins = getMinutesFromMidnight(event.end);

        const clampedStart = Math.max(
            originalStartMins,
            zotDateForEvent.earliestTime
        );
        const clampedEnd = Math.min(
            originalEndMins,
            zotDateForEvent.latestTime
        );

        if (clampedEnd <= clampedStart) {
            continue;
        }

        const startBlock = Math.floor(
            (clampedStart - zotDateForEvent.earliestTime) /
                zotDateForEvent.blockLength
        );
        const endBlock =
            Math.ceil(
                (clampedEnd - zotDateForEvent.earliestTime) /
                    zotDateForEvent.blockLength
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
            maxConcurrentInGroup: 1,
            startDateString: currentDateStr,
            startBlockIndex: startBlock,
            endBlockIndex: endBlock,
            calendarColor: event.calendarColor,
        };

        if (!eventsByDate.has(currentDateStr)) {
            eventsByDate.set(currentDateStr, []);
        }
        eventsByDate.get(currentDateStr)!.push(layoutInfo);
    }

    return eventsByDate;
}

function calculateEventLayout(
    eventsByDate: Map<string, GoogleCalendarEventLayoutInfo[]>
): Map<string, GoogleCalendarEventLayoutInfo[]> {
    eventsByDate.forEach((eventsForDay) => {
        if (eventsForDay.length === 0) return;

        // Sort events by start time and duration
        eventsForDay.sort(
            (a, b) =>
                a.clampedStartMinutes - b.clampedStartMinutes ||
                b.clampedEndMinutes -
                    b.originalStartMinutes -
                    (a.clampedEndMinutes - a.originalStartMinutes)
        );

        // Assign columns to events
        const columns: GoogleCalendarEventLayoutInfo[][] = [];
        for (const event of eventsForDay) {
            let placed = false;
            for (let i = 0; i < columns.length; i++) {
                const lastEventInCol = columns[i][columns[i].length - 1];
                if (
                    event.clampedStartMinutes >=
                    lastEventInCol.clampedEndMinutes
                ) {
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

        // Calculate max concurrent events
        for (const event of eventsForDay) {
            let currentMaxConcurrent = 0;
            for (const otherEvent of eventsForDay) {
                const startsBeforeOtherEnds =
                    event.clampedStartMinutes < otherEvent.clampedEndMinutes;
                const endsAfterOtherStarts =
                    event.clampedEndMinutes > otherEvent.clampedStartMinutes;
                if (startsBeforeOtherEnds && endsAfterOtherStarts) {
                    currentMaxConcurrent = Math.max(
                        currentMaxConcurrent,
                        otherEvent.assignedColumn + 1
                    );
                }
            }
            event.maxConcurrentInGroup = Math.max(1, currentMaxConcurrent);
        }

        // Propagate max concurrent among overlapping events
        for (const event of eventsForDay) {
            let groupSharedMaxConcurrent = event.maxConcurrentInGroup;
            for (const otherEvent of eventsForDay) {
                if (event.id === otherEvent.id) continue;
                const startsBeforeOtherEnds =
                    event.clampedStartMinutes < otherEvent.clampedEndMinutes;
                const endsAfterOtherStarts =
                    event.clampedEndMinutes > otherEvent.clampedStartMinutes;
                if (startsBeforeOtherEnds && endsAfterOtherStarts) {
                    groupSharedMaxConcurrent = Math.max(
                        groupSharedMaxConcurrent,
                        otherEvent.maxConcurrentInGroup
                    );
                }
            }
            event.maxConcurrentInGroup = groupSharedMaxConcurrent;
        }
    });

    return eventsByDate;
}

function createCellSegments(
    eventsByDate: Map<string, GoogleCalendarEventLayoutInfo[]>,
    currentPageAvailability: ZotDate[],
    currentPage: number,
    itemsPerPage: number,
    availabilityTimeBlocks: number[]
): ProcessedCellEventSegments {
    const segmentsMap: ProcessedCellEventSegments = new Map();

    currentPageAvailability.forEach((zotDate, pageDateIndex) => {
        if (!zotDate) return;

        const zotDateIndex = pageDateIndex + currentPage * itemsPerPage;
        const currentDateStr = getDatePart(zotDate.day.toISOString());
        const eventsToLayout = eventsByDate.get(currentDateStr) || [];

        eventsToLayout.forEach((eventLayout) => {
            for (
                let blockIdx = eventLayout.startBlockIndex;
                blockIdx <= eventLayout.endBlockIndex;
                blockIdx++
            ) {
                if (blockIdx < 0 || blockIdx >= availabilityTimeBlocks.length) {
                    continue;
                }

                // TODO: Standardize key convention
                const cellKey = `${zotDateIndex}_${blockIdx}`;
                if (!segmentsMap.has(cellKey)) {
                    segmentsMap.set(cellKey, []);
                }

                const segment: EventSegment = {
                    eventId: eventLayout.id,
                    summary: eventLayout.summary,
                    layoutInfo: { ...eventLayout },
                    isStartOfEventInCell:
                        blockIdx === eventLayout.startBlockIndex,
                    isEndOfEventInCell: blockIdx === eventLayout.endBlockIndex,
                    cellAssignedColumn: eventLayout.assignedColumn,
                    cellMaxConcurrentInGroup: eventLayout.maxConcurrentInGroup,
                    calendarColor: eventLayout.calendarColor,
                };
                segmentsMap.get(cellKey)!.push(segment);
            }
        });
    });

    return segmentsMap;
}
