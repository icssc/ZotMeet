"use client";

import { useEffect, useMemo, useState } from "react";
import { getTimestampFromBlockIndex } from "@/components/availability/group-availability";
import { AvailabilityBlocks } from "@/components/availability/table/availability-blocks";
import { AvailabilityNavButton } from "@/components/availability/table/availability-nav-button";
import { AvailabilityTableHeader } from "@/components/availability/table/availability-table-header";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import type {
    AvailabilityBlockType,
    EventSegment,
    GoogleCalendarEvent,
    GoogleCalendarEventLayoutInfo,
    MemberMeetingAvailability,
    ProcessedCellEventSegments,
} from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";
import { useBlockSelectionStore } from "@/store/useBlockSelectionStore";

const getMinutesFromMidnight = (isoOrDateString: string): number => {
    const date = new Date(isoOrDateString);
    return date.getHours() * 60 + date.getMinutes();
};

const getDatePart = (isoOrDateString: string): string => {
    return isoOrDateString.substring(0, 10);
};

interface PersonalAvailabilityProps {
    userAvailability: MemberMeetingAvailability | null;
    availabilityTimeBlocks: number[];
    fromTime: number;
    availabilityDates: ZotDate[];
    currentPageAvailability: ZotDate[];
    googleCalendarEvents: GoogleCalendarEvent[];
    onAvailabilityChange: (updatedDates: ZotDate[]) => void;
}

export function PersonalAvailability({
    userAvailability,
    fromTime,
    availabilityTimeBlocks,
    availabilityDates,
    currentPageAvailability,
    googleCalendarEvents,
    onAvailabilityChange,
}: PersonalAvailabilityProps) {
    const {
        startBlockSelection,
        setStartBlockSelection,
        endBlockSelection,
        setEndBlockSelection,
        selectionState,
        setSelectionState,
    } = useBlockSelectionStore();
    const [isEditingAvailability, setIsEditingAvailability] = useState(false);
    const [isStateUnsaved, setIsStateUnsaved] = useState(false);
    const { currentPage, itemsPerPage, nextPage, prevPage, isFirstPage } =
        useAvailabilityPaginationStore();

    const isLastPage =
        currentPage ===
        Math.floor((availabilityDates.length - 1) / itemsPerPage);

    const processedCellSegments = useMemo((): ProcessedCellEventSegments => {
        const segmentsMap: ProcessedCellEventSegments = new Map();
        if (
            !googleCalendarEvents ||
            googleCalendarEvents.length === 0 ||
            currentPageAvailability.length === 0
        ) {
            return segmentsMap;
        }

        // This will hold event layout info per day string (YYYY-MM-DD)
        const eventsByDate = new Map<string, GoogleCalendarEventLayoutInfo[]>();

        for (const event of googleCalendarEvents) {
            if (!event.start?.includes("T") || !event.end?.includes("T")) {
                continue;
            }

            const currentDateStr = getDatePart(event.start);
            const zotDateForEvent = currentPageAvailability.find(
                (zd) =>
                    zd && getDatePart(zd.day.toISOString()) === currentDateStr
            );

            // Only processes events that fall on one of currently displayed dates
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
                continue; // Event outside the visible time range or has no duration in it
            }

            const startBlock = Math.floor(
                (clampedStart - zotDateForEvent.earliestTime) /
                    zotDateForEvent.blockLength
            );
            const endBlock =
                Math.ceil(
                    (clampedEnd - zotDateForEvent.earliestTime) /
                        zotDateForEvent.blockLength
                ) - 1; // inclusive

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
            };

            if (!eventsByDate.has(currentDateStr)) {
                eventsByDate.set(currentDateStr, []);
            }
            eventsByDate.get(currentDateStr)!.push(layoutInfo);
        }

        // Calculates layout (columns, concurrency) for each day
        eventsByDate.forEach((eventsForDay) => {
            if (eventsForDay.length === 0) return;

            eventsForDay.sort(
                (a, b) =>
                    a.clampedStartMinutes - b.clampedStartMinutes ||
                    b.clampedEndMinutes -
                        b.originalStartMinutes -
                        (a.clampedEndMinutes - a.originalStartMinutes)
            );

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

            for (const event of eventsForDay) {
                let currentMaxConcurrent = 0;
                for (const otherEvent of eventsForDay) {
                    // Checks for time overlap
                    const startsBeforeOtherEnds =
                        event.clampedStartMinutes <
                        otherEvent.clampedEndMinutes;
                    const endsAfterOtherStarts =
                        event.clampedEndMinutes >
                        otherEvent.clampedStartMinutes;
                    if (startsBeforeOtherEnds && endsAfterOtherStarts) {
                        currentMaxConcurrent = Math.max(
                            currentMaxConcurrent,
                            otherEvent.assignedColumn + 1
                        );
                    }
                }
                event.maxConcurrentInGroup = Math.max(1, currentMaxConcurrent);
            }

            // Propagates true maxConcurrentInGroup among overlapping events
            for (const event of eventsForDay) {
                let groupSharedMaxConcurrent = event.maxConcurrentInGroup;
                for (const otherEvent of eventsForDay) {
                    if (event.id === otherEvent.id) continue;
                    const startsBeforeOtherEnds =
                        event.clampedStartMinutes <
                        otherEvent.clampedEndMinutes;
                    const endsAfterOtherStarts =
                        event.clampedEndMinutes >
                        otherEvent.clampedStartMinutes;
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

        // Creates segments for each cell on current page
        currentPageAvailability.forEach((zotDate, pageDateIndex) => {
            if (!zotDate) return;

            const zotDateIndex = pageDateIndex + currentPage * itemsPerPage;
            // ? Potentially consider date-based approach isntead of page-based, which would require passing in availabilityDates to AvailabilityBlocks
            // const zotDateIndex = availabilityDates.findIndex(
            //     (d) => d.day.getTime() === selectedDate.day.getTime()
            // );
            const currentDateStr = getDatePart(zotDate.day.toISOString());
            const eventsToLayout = eventsByDate.get(currentDateStr) || [];

            eventsToLayout.forEach((eventLayout) => {
                for (
                    let blockIdx = eventLayout.startBlockIndex;
                    blockIdx <= eventLayout.endBlockIndex;
                    blockIdx++
                ) {
                    if (
                        blockIdx < 0 ||
                        blockIdx >= availabilityTimeBlocks.length
                    ) {
                        continue;
                    }

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
                        isEndOfEventInCell:
                            blockIdx === eventLayout.endBlockIndex,
                        cellAssignedColumn: eventLayout.assignedColumn,
                        cellMaxConcurrentInGroup:
                            eventLayout.maxConcurrentInGroup,
                    };
                    segmentsMap.get(cellKey)!.push(segment);
                }
            });
        });

        return segmentsMap;
    }, [
        googleCalendarEvents,
        currentPageAvailability,
        availabilityTimeBlocks,
        currentPage,
        itemsPerPage,
    ]);

    useEffect(() => {
        if (startBlockSelection && endBlockSelection) {
            setSelectionState({
                earlierDateIndex: Math.min(
                    startBlockSelection.zotDateIndex,
                    endBlockSelection.zotDateIndex
                ),
                laterDateIndex: Math.max(
                    startBlockSelection.zotDateIndex,
                    endBlockSelection.zotDateIndex
                ),
                earlierBlockIndex: Math.min(
                    startBlockSelection.blockIndex,
                    endBlockSelection.blockIndex
                ),
                laterBlockIndex: Math.max(
                    startBlockSelection.blockIndex,
                    endBlockSelection.blockIndex
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

            const startSelectionZotDate =
                availabilityDates[selectionStartDateIndex];
            const selectionValue = !startSelectionZotDate.getBlockAvailability(
                selectionStartBlockIndex
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
                    selectionValue
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
                        availabilityDates
                    );

                    // Initialize empty array if timestamp doesn't exist
                    if (!currentDate.groupAvailability[timestamp]) {
                        currentDate.groupAvailability[timestamp] = [];
                    }

                    if (selectionValue) {
                        // Add user to availability if not already present
                        if (
                            !currentDate.groupAvailability[timestamp].includes(
                                userAvailability?.memberId ?? ""
                            )
                        ) {
                            currentDate.groupAvailability[timestamp].push(
                                userAvailability?.memberId ?? ""
                            );
                        }
                    } else {
                        // Remove user from availability
                        currentDate.groupAvailability[timestamp] =
                            currentDate.groupAvailability[timestamp].filter(
                                (id) =>
                                    id !== (userAvailability?.memberId ?? "")
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
        <div className="flex flex-row items-start justify-start align-top">
            <div className="flex h-fit items-center justify-between overflow-x-auto font-dm-sans lg:w-full lg:pr-14">
                <AvailabilityNavButton
                    direction="left"
                    handleClick={prevPage}
                    disabled={isFirstPage}
                />

                <table className="w-full table-fixed">
                    <AvailabilityTableHeader
                        currentPageAvailability={currentPageAvailability}
                    />

                    <tbody>
                        {availabilityTimeBlocks.map((timeBlock, blockIndex) => {
                            const isTopOfHour = timeBlock % 60 === 0;
                            const isHalfHour = timeBlock % 60 === 30;
                            const isLastRow =
                                blockIndex ===
                                availabilityTimeBlocks.length - 1;

                            return (
                                <tr key={`block-${timeBlock}`}>
                                    <AvailabilityTimeTicks
                                        timeBlock={timeBlock}
                                    />

                                    <AvailabilityBlocks
                                        setAvailabilities={setAvailabilities}
                                        isTopOfHour={isTopOfHour}
                                        isHalfHour={isHalfHour}
                                        isLastRow={isLastRow}
                                        timeBlock={timeBlock}
                                        blockIndex={blockIndex}
                                        currentPage={currentPage}
                                        itemsPerPage={itemsPerPage}
                                        currentPageAvailability={
                                            currentPageAvailability
                                        }
                                        processedCellSegments={
                                            processedCellSegments
                                        }
                                    />
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <AvailabilityNavButton
                    direction="right"
                    handleClick={() => nextPage(availabilityDates.length)}
                    disabled={isLastPage}
                />
            </div>
        </div>
    );
}
