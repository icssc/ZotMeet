"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useAvailabilityContext } from "@/components/availability/context/availability-context";
import { getTimestampFromBlockIndex } from "@/components/availability/group-availability";
import { AvailabilityBlocks } from "@/components/availability/table/availability-blocks";
import { AvailabilityNavButton } from "@/components/availability/table/availability-nav-button";
import { AvailabilityTableHeader } from "@/components/availability/table/availability-table-header";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import {
    AvailabilityBlockType,
    MemberMeetingAvailability,
    SelectionStateType,
} from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";

interface PersonalAvailabilityProps {
    meetingDates: string[];
    userAvailability: MemberMeetingAvailability | null;
    availabilityTimeBlocks: number[];
    fromTime: number;
    availabilityDates: ZotDate[];
    setAvailabilityDates: Dispatch<SetStateAction<ZotDate[]>>;
}

export function PersonalAvailability({
    meetingDates,
    userAvailability,
    fromTime,
    availabilityTimeBlocks,
    availabilityDates,
    setAvailabilityDates,
}: PersonalAvailabilityProps) {
    const [startBlockSelection, setStartBlockSelection] =
        useState<AvailabilityBlockType>();
    const [endBlockSelection, setEndBlockSelection] =
        useState<AvailabilityBlockType>();
    const [selectionState, setSelectionState] = useState<SelectionStateType>();
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPageAvailability, setCurrentPageAvailability] =
        useState<ZotDate[]>();
    const [isEditingAvailability, setIsEditingAvailability] = useState(false);
    const [isStateUnsaved, setIsStateUnsaved] = useState(false);

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
                                !currentDate.groupAvailability[
                                    timestamp
                                ].includes(userAvailability?.memberId ?? "")
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
                                        id !==
                                        (userAvailability?.memberId ?? "")
                                );
                        }
                    }
                }

                console.log(updatedDates);

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
                                        isTopOfHour={isTopOfHour}
                                        isHalfHour={isHalfHour}
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
