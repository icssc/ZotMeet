"use client";

import { useEffect, useMemo, useState } from "react";
import { metadata } from "@/app/layout";
import { useAvailabilityContext } from "@/components/availability/context/availability-context";
import { AvailabilityBlocks } from "@/components/availability/table/availability-blocks";
import { AvailabilityNavButton } from "@/components/availability/table/availability-nav-button";
import { AvailabilityTableHeader } from "@/components/availability/table/availability-table-header";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import {
    AvailabilityMeetingDateJoinSchema,
    MeetingDateSelectSchema,
    SelectMeeting,
} from "@/db/schema";
import { AvailabilityBlockType } from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";

// import LoginFlow from "./LoginModal";

interface PersonalAvailabilityProps {
    columns: number;
    meetingData: SelectMeeting;
    meetingDates: MeetingDateSelectSchema[];
    availability: AvailabilityMeetingDateJoinSchema[] | null;
    availabilityTimeBlocks: number[];
}

export function PersonalAvailability({
    columns,
    meetingData,
    meetingDates,
    availability,
    availabilityTimeBlocks,
}: PersonalAvailabilityProps) {
    const {
        startBlockSelection,
        setStartBlockSelection,
        endBlockSelection,
        setEndBlockSelection,
        selectionState,
        setSelectionState,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        setCurrentPageAvailability,
        isEditingAvailability,
        setIsEditingAvailability,
        isStateUnsaved,
        setIsStateUnsaved,
        availabilityDates,
        setAvailabilityDates,
    } = useAvailabilityContext();

    const [guestSession, setGuestSession] = useState({
        meetingId: meetingData.id || "",
    });

    useEffect(() => {
        setItemsPerPage(columns);
    }, [columns, setItemsPerPage]);

    const numPaddingDates = useMemo(() => {
        return availabilityDates.length % itemsPerPage === 0
            ? 0
            : itemsPerPage - (availabilityDates.length % itemsPerPage);
    }, [availabilityDates.length, itemsPerPage]);

    const lastPage = useMemo(() => {
        return Math.floor((availabilityDates.length - 1) / itemsPerPage);
    }, [availabilityDates.length, itemsPerPage]);

    useEffect(() => {
        const datesToOffset = currentPage * itemsPerPage;
        let pageAvailability = availabilityDates.slice(
            datesToOffset,
            datesToOffset + itemsPerPage
        );

        if (currentPage === lastPage) {
            pageAvailability = pageAvailability.concat(
                new Array(numPaddingDates).fill(null)
            );
        }
        setCurrentPageAvailability(pageAvailability);
    }, [
        currentPage,
        itemsPerPage,
        availabilityDates,
        lastPage,
        numPaddingDates,
        setCurrentPageAvailability,
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

            setAvailabilityDates((currentAvailabilityDates) => {
                const updatedDates = [...currentAvailabilityDates];
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
                }
                return updatedDates;
            });

            setStartBlockSelection(undefined);
            setEndBlockSelection(undefined);
            setSelectionState(undefined);
            setIsStateUnsaved(true);
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

    useEffect(() => {
        if (!meetingDates || meetingDates.length === 0) return;

        if (!availability || availability?.length === 0) {
            const emptyDates = meetingDates.map(
                (meetingDate) => new ZotDate(new Date(meetingDate), false)
            );

            emptyDates.forEach((date) => {
                date.earliestTime =
                    availabilityTimeBlocks.length > 0
                        ? availabilityTimeBlocks[0]
                        : 480;
                date.latestTime =
                    availabilityTimeBlocks.length > 0
                        ? availabilityTimeBlocks[
                              availabilityTimeBlocks.length - 1
                          ] + 15
                        : 1050;
            });

            setAvailabilityDates(emptyDates);
            return;
        }

        const convertedDates = availability.map((availabilityItem) => {
            const date = new Date(availabilityItem.meeting_dates);
            const ISOAvailability: string[] = [];

            const earliestMinutes =
                availabilityTimeBlocks.length > 0
                    ? availabilityTimeBlocks[0]
                    : 480;

            const latestMinutes =
                availabilityTimeBlocks.length > 0
                    ? availabilityTimeBlocks[
                          availabilityTimeBlocks.length - 1
                      ] + 15
                    : 1050;

            Array.from(
                availabilityItem.availabilities.availabilityString
            ).forEach((char, index) => {
                if (char === "1") {
                    const minutesFromMidnight = earliestMinutes + index * 15;

                    const timeDate = new Date(date);
                    timeDate.setHours(Math.floor(minutesFromMidnight / 60));
                    timeDate.setMinutes(minutesFromMidnight % 60);
                    timeDate.setSeconds(0);
                    timeDate.setMilliseconds(0);

                    ISOAvailability.push(timeDate.toISOString());
                }
            });
            const zotDate = new ZotDate(date, false, ISOAvailability);
            zotDate.earliestTime = earliestMinutes;
            zotDate.latestTime = latestMinutes;

            return zotDate;
        });

        setAvailabilityDates(convertedDates);
    }, [
        availability,
        meetingDates,
        setAvailabilityDates,
        availabilityTimeBlocks,
    ]);

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < lastPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between overflow-x-auto font-dm-sans">
                <AvailabilityNavButton
                    direction="left"
                    handleClick={handlePrevPage}
                    disabled={currentPage === 0}
                />

                <table className="w-full table-fixed">
                    <AvailabilityTableHeader />

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
                                    />
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <AvailabilityNavButton
                    direction="right"
                    handleClick={handleNextPage}
                    disabled={currentPage === lastPage}
                />
            </div>
        </div>
    );
}
