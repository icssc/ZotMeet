"use client";

import { useEffect, useMemo, useState } from "react";
import { AvailabilityBlock } from "@/app/components/availability/availability-block";
import {
    AvailabilityMeetingDateJoinSchema,
    MeetingDateSelectSchema,
    MeetingSelectSchema,
} from "@/db/schema";
import {
    AvailabilityBlockType,
    SelectionStateType,
} from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";

// import LoginFlow from "./LoginModal";

interface PersonalAvailabilityProps {
    columns: number;
    meetingData: MeetingSelectSchema;
    defaultDates: MeetingDateSelectSchema[];
    availability: AvailabilityMeetingDateJoinSchema[] | null;
}

export function PersonalAvailability({
    columns,
    meetingData,
    defaultDates,
    availability,
}: PersonalAvailabilityProps) {
    const [itemsPerPage, setItemsPerPage] = useState(columns);
    const [availabilityDates, setAvailabilityDates] = useState<ZotDate[]>([]);
    const [availabilityTimeBlocks, setAvailabilityTimeBlocks] = useState<
        number[]
    >([]);
    const [guestSession, setGuestSession] = useState({
        meetingId: meetingData.id || "",
    });
    const [isEditingAvailability, setIsEditingAvailability] = useState(false);
    const [isStateUnsaved, setIsStateUnsaved] = useState(false);

    const [startBlockSelection, setStartBlockSelection] =
        useState<AvailabilityBlockType>();
    const [endBlockSelection, setEndBlockSelection] =
        useState<AvailabilityBlockType>();
    const [selectionState, setSelectionState] = useState<SelectionStateType>();

    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageAvailability, setCurrentPageAvailability] =
        useState<ZotDate[]>();

    useEffect(() => {
        setItemsPerPage(columns);
    }, [columns]);

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
    }, [startBlockSelection, endBlockSelection]);

    const generateDateKey = (
        selectedDate: ZotDate,
        timeBlock: number,
        pageDateIndex: number
    ) => {
        return selectedDate
            ? `date-${selectedDate.valueOf()}-${timeBlock}`
            : `padding-${pageDateIndex}`;
    };

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

            setStartBlockSelection(null);
            setEndBlockSelection(null);
            setSelectionState(null);
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

    // useEffect(() => {
    //     const init = async () => {
    //         setGuestSession((prev) => ({
    //             ...prev,
    //             meetingId: meetingData.id || "",
    //         }));

    //         // const generalAvailability = await getGeneralAvailability(
    //         //     meetingData,
    //         //     guestSession
    //         // );

    //         const generalAvailability: Array<unknown> | null = null;

    //         const defaultMeetingDates = defaultDates.map(
    //             (item) => new ZotDate(item.date, false, [])
    //         );

    //         ZotDate.initializeAvailabilities(defaultMeetingDates);

    //         setAvailabilityDates(
    //             generalAvailability && generalAvailability.length > 0
    //                 ? generalAvailability
    //                 : defaultMeetingDates
    //         );
    //     };

    //     init();
    // }, [defaultDates, guestSession, meetingData]);

    // Sample availabilityTimeBlocks; replace with your actual data
    useEffect(() => {
        // Replace with your actual logic to set availabilityTimeBlocks
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
                <button
                    onClick={handlePrevPage}
                    className="p-3 pl-0 disabled:opacity-0 md:pl-1"
                    disabled={currentPage === 0}
                >
                    <span className="text-3xl text-gray-500">&lsaquo;</span>
                </button>

                <table className="w-full table-fixed">
                    <thead>
                        <tr>
                            <th className="w-10 md:w-16">
                                <span className="sr-only">Time</span>
                            </th>
                            {currentPageAvailability?.map(
                                (dateHeader, index) => (
                                    <th
                                        key={index}
                                        className="text-sm font-normal"
                                    >
                                        {dateHeader && (
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold uppercase text-gray-500 md:text-xs">
                                                    {dateHeader.day.toLocaleDateString(
                                                        "en-US",
                                                        { weekday: "short" }
                                                    )}
                                                </span>
                                                <span className="text-gray-medium text-center text-[12px] uppercase md:text-base">
                                                    {dateHeader.day.toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "numeric",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>

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

                                    {currentPageAvailability?.map(
                                        (selectedDate, pageDateIndex) => {
                                            const key = generateDateKey(
                                                selectedDate,
                                                timeBlock,
                                                pageDateIndex
                                            );

                                            if (selectedDate) {
                                                const zotDateIndex =
                                                    pageDateIndex +
                                                    currentPage * itemsPerPage;
                                                const availabilitySelection = {
                                                    zotDateIndex: zotDateIndex,
                                                    blockIndex: blockIndex,
                                                };
                                                const isAvailable =
                                                    selectedDate.getBlockAvailability(
                                                        blockIndex
                                                    );

                                                return (
                                                    <td
                                                        key={key}
                                                        onMouseUp={() => {
                                                            if (
                                                                startBlockSelection
                                                            ) {
                                                                setEndBlockSelection(
                                                                    availabilitySelection
                                                                );
                                                                setAvailabilities(
                                                                    startBlockSelection
                                                                );
                                                            }
                                                        }}
                                                        className="px-0 py-0"
                                                    >
                                                        <button
                                                            onTouchStart={(
                                                                e
                                                            ) => {
                                                                if (
                                                                    e.cancelable
                                                                ) {
                                                                    e.preventDefault();
                                                                }
                                                                setStartBlockSelection(
                                                                    availabilitySelection
                                                                );
                                                                setEndBlockSelection(
                                                                    availabilitySelection
                                                                );
                                                            }}
                                                            onMouseDown={() => {
                                                                setStartBlockSelection(
                                                                    availabilitySelection
                                                                );
                                                                setEndBlockSelection(
                                                                    availabilitySelection
                                                                );
                                                            }}
                                                            onTouchMove={
                                                                handleTouchMove
                                                            }
                                                            onMouseMove={() => {
                                                                if (
                                                                    startBlockSelection
                                                                ) {
                                                                    setEndBlockSelection(
                                                                        availabilitySelection
                                                                    );
                                                                }
                                                            }}
                                                            onTouchEnd={(e) => {
                                                                if (
                                                                    e.cancelable
                                                                ) {
                                                                    e.preventDefault();
                                                                }
                                                                if (
                                                                    startBlockSelection
                                                                ) {
                                                                    setEndBlockSelection(
                                                                        availabilitySelection
                                                                    );
                                                                    setAvailabilities(
                                                                        startBlockSelection
                                                                    );
                                                                }
                                                            }}
                                                            // TODO: Fix
                                                            // tabIndex="0"
                                                            data-date-index={
                                                                zotDateIndex
                                                            }
                                                            data-block-index={
                                                                blockIndex
                                                            }
                                                            className={cn(
                                                                "border-gray-medium block h-full w-full cursor-row-resize border-r-[1px]",
                                                                isTopOfHour &&
                                                                    "border-t-gray-medium border-t-[1px]",
                                                                isHalfHour &&
                                                                    "border-t-gray-base border-t-[1px]",
                                                                isLastRow &&
                                                                    "border-b-[1px]"
                                                            )}
                                                        >
                                                            <AvailabilityBlock
                                                                isAvailable={
                                                                    isAvailable
                                                                }
                                                                zotDateIndex={
                                                                    zotDateIndex
                                                                }
                                                                blockIndex={
                                                                    blockIndex
                                                                }
                                                                selectionState={
                                                                    selectionState
                                                                }
                                                            />
                                                        </button>
                                                    </td>
                                                );
                                            } else {
                                                return <td key={key}></td>;
                                            }
                                        }
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <button
                    onClick={handleNextPage}
                    className="p-3 pr-0 disabled:opacity-0 md:pr-1"
                    disabled={currentPage === lastPage}
                >
                    <span className="text-3xl text-gray-500">&rsaquo;</span>
                </button>
            </div>

            {/* <LoginFlow data={data} /> */}
        </div>
    );
}

export default PersonalAvailability;
