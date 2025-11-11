"use client";

import { useEffect, useState } from "react";
import { getTimestampFromBlockIndex } from "@/components/availability/group-availability";
import { AvailabilityBlocks } from "@/components/availability/table/availability-blocks";
import { AvailabilityNavButton } from "@/components/availability/table/availability-nav-button";
import { AvailabilityTableHeader } from "@/components/availability/table/availability-table-header";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { useGoogleCalendar } from "@/hooks/use-google-calendar";
import { UserProfile } from "@/lib/auth/user";
import type {
    AvailabilityBlockType,
    GoogleCalendarEvent,
} from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";
import { useBlockSelectionStore } from "@/store/useBlockSelectionStore";

interface PersonalAvailabilityProps {
    availabilityTimeBlocks: number[];
    fromTime: number;
    availabilityDates: ZotDate[];
    currentPageAvailability: ZotDate[];
    googleCalendarEvents: GoogleCalendarEvent[];
    user: UserProfile | null;
    onAvailabilityChange: (updatedDates: ZotDate[]) => void;
    spacerBeforeDate: boolean[];
}

export function PersonalAvailability({
    fromTime,
    availabilityTimeBlocks,
    availabilityDates,
    currentPageAvailability,
    googleCalendarEvents,
    user,
    onAvailabilityChange,
    spacerBeforeDate,
}: PersonalAvailabilityProps) {
    const {
        startBlockSelection,
        setStartBlockSelection,
        endBlockSelection,
        setEndBlockSelection,
        selectionState,
        setSelectionState,
    } = useBlockSelectionStore();
    const { currentPage, itemsPerPage, nextPage, prevPage, isFirstPage } =
        useAvailabilityPaginationStore();

    const [isEditingAvailability, setIsEditingAvailability] = useState(false);
    const [isStateUnsaved, setIsStateUnsaved] = useState(false);

    const isLastPage =
        currentPage ===
        Math.floor((availabilityDates.length - 1) / itemsPerPage);

    const { processedCellSegments } = useGoogleCalendar({
        googleCalendarEvents,
        currentPageAvailability,
        availabilityTimeBlocks,
        currentPage,
        itemsPerPage,
    });

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
                                user?.memberId ?? ""
                            )
                        ) {
                            currentDate.groupAvailability[timestamp].push(
                                user?.memberId ?? ""
                            );
                        }
                    } else {
                        // Remove user from availability
                        currentDate.groupAvailability[timestamp] =
                            currentDate.groupAvailability[timestamp].filter(
                                (id) => id !== (user?.memberId ?? "")
                            );
                    }
                }
            }

            setStartBlockSelection(undefined);
            setEndBlockSelection(undefined);
            setSelectionState(undefined);
            setIsStateUnsaved(true);
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
                        spacerBeforeDate={spacerBeforeDate}
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
                                        spacerBeforeDate={spacerBeforeDate}
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
