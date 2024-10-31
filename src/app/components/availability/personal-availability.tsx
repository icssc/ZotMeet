"use client";

import { useEffect, useMemo, useState } from "react";
import { AvailabilityBlocks } from "@/app/components/availability/availability-blocks";
import { AvailabilityHeader } from "@/app/components/availability/availability-header";
import { AvailabilityNavButton } from "@/app/components/availability/availability-nav-button";
import { useAvailabilityContext } from "@/app/components/availability/context/availability-context";
import {
    AvailabilityMeetingDateJoinSchema,
    MeetingDateSelectSchema,
    MeetingSelectSchema,
} from "@/db/schema";
import { AvailabilityBlockType } from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";

// import LoginFlow from "./LoginModal";

interface PersonalAvailabilityProps {
    columns: number;
    meetingData: MeetingSelectSchema;
    meetingDates: MeetingDateSelectSchema[];
    availability: AvailabilityMeetingDateJoinSchema[] | null;
}

export function PersonalAvailability({
    columns,
    meetingData,
    meetingDates,
    availability,
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
    } = useAvailabilityContext();

    const [availabilityDates, setAvailabilityDates] = useState<ZotDate[]>([]);
    const [availabilityTimeBlocks, setAvailabilityTimeBlocks] = useState<
        number[]
    >([]);

    const [guestSession, setGuestSession] = useState({
        meetingId: meetingData.id || "",
    });

    const [isEditingAvailability, setIsEditingAvailability] = useState(false);
    const [isStateUnsaved, setIsStateUnsaved] = useState(false);

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

    const handleTouchMove = (e: React.TouchEvent) => {
        const touchingElement = document.elementFromPoint(
            e.touches[0].clientX,
            e.touches[0].clientY
        );

        if (!touchingElement) return;

        const touchingDateIndex = parseInt(
            touchingElement.getAttribute("data-date-index") || "",
            10
        );
        const touchingBlockIndex = parseInt(
            touchingElement.getAttribute("data-block-index") || "",
            10
        );

        if (
            !isNaN(touchingDateIndex) &&
            !isNaN(touchingBlockIndex) &&
            startBlockSelection
        ) {
            setEndBlockSelection({
                zotDateIndex: touchingDateIndex,
                blockIndex: touchingBlockIndex,
            });
        }
    };

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
        const init = async () => {
            // const generalAvailability = await getGeneralAvailability(
            //     meetingData,
            //     guestSession
            // );

            const generalAvailability: Array<unknown> | null = null;

            const defaultMeetingDates = meetingDates.map(
                (item) => new ZotDate(item.date, false, [])
            );

            ZotDate.initializeAvailabilities(defaultMeetingDates);

            setAvailabilityDates(
                generalAvailability && generalAvailability.length > 0
                    ? generalAvailability
                    : defaultMeetingDates
            );
        };

        init();
    }, [meetingData, meetingDates]);

    // TODO: use actual meeting times
    useEffect(() => {
        setAvailabilityTimeBlocks([0, 30, 60, 90, 120, 150, 180]);
    }, []);

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
            <div className="font-dm-sans flex items-center justify-between overflow-x-auto">
                <AvailabilityNavButton
                    direction="left"
                    handleClick={handlePrevPage}
                    disabled={currentPage === 0}
                />

                <table className="w-full table-fixed">
                    <AvailabilityHeader />

                    <tbody>
                        {availabilityTimeBlocks.map((timeBlock, blockIndex) => {
                            const isTopOfHour = timeBlock % 60 === 0;
                            const isHalfHour = timeBlock % 60 === 30;
                            const isLastRow =
                                blockIndex ===
                                availabilityTimeBlocks.length - 1;

                            return (
                                <tr key={`block-${timeBlock}`}>
                                    <td className="border-r-gray-medium w-2 border-r-[1px] py-0 pr-3 align-top">
                                        {isTopOfHour && (
                                            <>
                                                <span className="text-gray-medium float-right hidden whitespace-nowrap text-[10px] font-bold md:flex md:text-xs">
                                                    {ZotDate.toTimeBlockString(
                                                        timeBlock,
                                                        false
                                                    )}
                                                </span>
                                                <span className="text-gray-medium float-right flex whitespace-nowrap text-[10px] font-bold md:hidden md:text-xs">
                                                    {ZotDate.toTimeBlockString(
                                                        timeBlock,
                                                        true
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </td>

                                    <AvailabilityBlocks
                                        setAvailabilities={setAvailabilities}
                                        handleTouchMove={handleTouchMove}
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

            {/* <LoginFlow data={data} /> */}
        </div>
    );
}

export default PersonalAvailability;
