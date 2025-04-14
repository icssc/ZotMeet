"use client";

import { group } from "console";
import React, { useEffect, useMemo, useState } from "react";
import { GroupAvailabilityBlock } from "@/components/availability/group-availability-block";
import { GroupResponses } from "@/components/availability/group-responses";
import { AvailabilityNavButton } from "@/components/availability/table/availability-nav-button";
import { AvailabilityTableHeader } from "@/components/availability/table/availability-table-header";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { generateDates, generateSampleDates } from "@/lib/availability/utils";
import { MemberAvailability } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";

interface GroupAvailabilityProps {
    columns: number;
    availabilityDates: ZotDate[];
    availabilityTimeBlocks: number[];
    groupAvailabilities: MemberAvailability[];
    //fromTime: string;
    //groupAvailabilities: any;
    //meetingId: string;
}
export function GroupAvailability({
    columns,
    availabilityDates: _,
    availabilityTimeBlocks,
    groupAvailabilities,
}: GroupAvailabilityProps) {
    //const availabilityDates = useMemo(() => generateSampleDates(), []); // TODO: replace with actual data
    const availabilityDates = useMemo(
        () => generateDates(8, 17, groupAvailabilities),
        []
    );

    console.log("GROUP AVAILABILITY RENDERED");
    console.log("availability dates:", availabilityDates);
    console.log("availability dates1:", availabilityDates[0]);

    const itemsPerPage = columns;
    const lastPage = Math.floor((availabilityDates.length - 1) / itemsPerPage);
    const numPaddingDates =
        availabilityDates.length % itemsPerPage === 0
            ? 0
            : itemsPerPage - (availabilityDates.length % itemsPerPage);

    const [currentPage, setCurrentPage] = useState(0);

    const datesToOffset = currentPage * itemsPerPage;
    const newCurrentPageAvailability = availabilityDates.slice(
        datesToOffset,
        datesToOffset + itemsPerPage
    );

    const [currentPageAvailability, setCurrentPageAvailability] = useState<
        ZotDate[]
    >(newCurrentPageAvailability);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [selectedZotDateIndex, setSelectedZotDateIndex] = useState<number>();
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>();
    const [availableMembersOfSelection, setAvailableMembersOfSelection] =
        useState<string[]>([]);
    const [notAvailableMembersOfSelection, setNotAvailableMembersOfSelection] =
        useState<string[]>([]);
    const [selectionIsLocked, setSelectionIsLocked] = useState(false);

    const generateDateKey = ({
        selectedDate,
        timeBlock,
        pageDateIndex,
    }: {
        selectedDate: ZotDate;
        timeBlock: number;
        pageDateIndex: number;
    }) => {
        return selectedDate
            ? `date-${selectedDate.valueOf()}-${timeBlock}`
            : `padding-${pageDateIndex}`;
    };

    const updateSelection = ({
        zotDateIndex,
        blockIndex,
    }: {
        zotDateIndex: number;
        blockIndex: number;
    }) => {
        setIsMobileDrawerOpen(true);
        setSelectedZotDateIndex(zotDateIndex);
        setSelectedBlockIndex(blockIndex);
    };

    const resetSelection = () => {
        setIsMobileDrawerOpen(false);
        setSelectedZotDateIndex(undefined);
        setSelectedBlockIndex(undefined);
    };

    const handleCellClick = ({
        isSelected,
        zotDateIndex,
        blockIndex,
    }: {
        isSelected: boolean;
        zotDateIndex: number;
        blockIndex: number;
    }) => {
        if (selectionIsLocked && isSelected) {
            setSelectionIsLocked(false);
        } else {
            setSelectionIsLocked(true);
            updateSelection({ zotDateIndex, blockIndex });
        }
    };

    const handleCellHover = ({
        zotDateIndex,
        blockIndex,
    }: {
        zotDateIndex: number;
        blockIndex: number;
    }) => {
        if (!selectionIsLocked) {
            updateSelection({ zotDateIndex, blockIndex });
        }
    };

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

    // Update current page availability on pagination or data change
    useEffect(() => {
        console.log("YO DAWG");
        const datesToOffset = currentPage * itemsPerPage;
        let newCurrentPageAvailability = availabilityDates.slice(
            datesToOffset,
            datesToOffset + itemsPerPage
        );

        if (currentPage === lastPage) {
            newCurrentPageAvailability = newCurrentPageAvailability.concat(
                new Array(numPaddingDates).fill(null)
            );
        }

        console.log(
            "new current page availability",
            newCurrentPageAvailability
        );

        setCurrentPageAvailability(newCurrentPageAvailability);
    }, [
        currentPage,
        itemsPerPage,
        availabilityDates,
        numPaddingDates,
        lastPage,
    ]);

    // Update selection members when selection changes
    useEffect(() => {
        if (
            selectedZotDateIndex !== undefined &&
            selectedBlockIndex !== undefined
        ) {
            const selectedDate = availabilityDates[selectedZotDateIndex];
            const availableMemberIndices =
                selectedDate.getGroupAvailabilityBlock(selectedBlockIndex) ??
                [];

            const newAvailableMembersOfSelection = availableMemberIndices.map(
                (availableMemberIndex) =>
                    groupAvailabilities[availableMemberIndex]?.memberId
            );

            const newNotAvailableMembersOfSelection = groupAvailabilities
                .filter((_, index) => !availableMemberIndices.includes(index))
                .map((member) => member.name);

            setAvailableMembersOfSelection(newAvailableMembersOfSelection);
            setNotAvailableMembersOfSelection(
                newNotAvailableMembersOfSelection
            );
        }
    }, [
        selectedZotDateIndex,
        selectedBlockIndex,
        availabilityDates,
        groupAvailabilities,
    ]);

    console.log("render render erendre");
    console.log("current PageAva", currentPageAvailability);

    return (
        <div className="flex flex-row items-start justify-start align-top">
            <div className="flex h-fit items-center justify-between overflow-x-auto font-dm-sans lg:w-full lg:pr-10">
                <AvailabilityNavButton
                    direction="left"
                    handleClick={handlePrevPage}
                    disabled={currentPage === 0}
                />

                <table className="w-full table-fixed">
                    <AvailabilityTableHeader />

                    <tbody>
                        {availabilityTimeBlocks.map(
                            (timeBlock, blockIndex, fromTime) => {
                                const isTopOfHour = timeBlock % 60 === 0;
                                const isHalfHour = timeBlock % 60 === 30;
                                console.log("THE BLOCK INDEX", blockIndex);
                                //console.log(availabilityTimeBlocks.length - 1);
                                const isLastRow =
                                    blockIndex ===
                                    availabilityTimeBlocks.length - 1;

                                return (
                                    <tr key={`block-${timeBlock}`}>
                                        <AvailabilityTimeTicks
                                            timeBlock={timeBlock}
                                        />

                                        {currentPageAvailability.map(
                                            (selectedDate, pageDateIndex) => {
                                                const key = generateDateKey({
                                                    selectedDate,
                                                    timeBlock,
                                                    pageDateIndex,
                                                });

                                                if (selectedDate) {
                                                    // console.log(
                                                    //     "selected date",
                                                    //     selectedDate
                                                    // );

                                                    const zotDateIndex =
                                                        pageDateIndex +
                                                        currentPage *
                                                            itemsPerPage;
                                                    // console.log(
                                                    //     "BLOCKINDEX",
                                                    //     blockIndex
                                                    // );
                                                    // console.log(
                                                    //     "Availability time block for block index",
                                                    //     blockIndex,
                                                    //     availabilityTimeBlocks[
                                                    //         blockIndex
                                                    //     ]
                                                    // );
                                                    // console.log(
                                                    //     "hellllll",
                                                    //     groupAvailabilities[
                                                    //         "2025-04-04T10:00:00Z"
                                                    //     ]
                                                    // );
                                                    // console.log(
                                                    //     "Selected date",
                                                    //     selectedDate
                                                    // );

                                                    const availableMemberIndices =
                                                        selectedDate.getGroupAvailabilityBlock(
                                                            fromTime[0],
                                                            blockIndex
                                                        );

                                                    // const availableMemberIndices =
                                                    //     selectedDate.getGroupAvailabilityBlock(
                                                    //         groupAvailabilities[]
                                                    //     );

                                                    console.log(
                                                        "available member indices",
                                                        availableMemberIndices
                                                    );

                                                    const isSelected =
                                                        selectedZotDateIndex ===
                                                            zotDateIndex &&
                                                        selectedBlockIndex ===
                                                            blockIndex;
                                                    const tableCellStyles = cn(
                                                        isTopOfHour &&
                                                            "border-t-[1px] border-t-gray-medium",
                                                        isHalfHour &&
                                                            "border-t-[1px] border-t-gray-base",
                                                        isLastRow &&
                                                            "border-b-[1px]",
                                                        isSelected &&
                                                            "outline-dashed outline-2 outline-slate-500"
                                                    );

                                                    return (
                                                        <td
                                                            key={key}
                                                            className="px-0 py-0"
                                                        >
                                                            <GroupAvailabilityBlock
                                                                className="hidden lg:block"
                                                                onClick={() =>
                                                                    handleCellClick(
                                                                        {
                                                                            isSelected,
                                                                            zotDateIndex,
                                                                            blockIndex,
                                                                        }
                                                                    )
                                                                }
                                                                onHover={() =>
                                                                    handleCellHover(
                                                                        {
                                                                            zotDateIndex,
                                                                            blockIndex,
                                                                        }
                                                                    )
                                                                }
                                                                groupAvailabilities={
                                                                    groupAvailabilities
                                                                }
                                                                availableMemberIndices={
                                                                    availableMemberIndices
                                                                }
                                                                tableCellStyles={
                                                                    tableCellStyles
                                                                }
                                                            />
                                                            <GroupAvailabilityBlock
                                                                className="block lg:hidden"
                                                                onClick={() =>
                                                                    handleCellClick(
                                                                        {
                                                                            isSelected,
                                                                            zotDateIndex,
                                                                            blockIndex,
                                                                        }
                                                                    )
                                                                }
                                                                groupAvailabilities={
                                                                    groupAvailabilities
                                                                }
                                                                availableMemberIndices={
                                                                    availableMemberIndices
                                                                }
                                                                tableCellStyles={
                                                                    tableCellStyles
                                                                }
                                                            />
                                                        </td>
                                                    );
                                                } else {
                                                    return <td key={key}></td>;
                                                }
                                            }
                                        )}
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>

                <AvailabilityNavButton
                    direction="right"
                    handleClick={handleNextPage}
                    disabled={currentPage === lastPage}
                />
            </div>

            <GroupResponses
                availabilityDates={availabilityDates}
                isMobileDrawerOpen={isMobileDrawerOpen}
                selectedZotDateIndex={selectedZotDateIndex}
                selectedBlockIndex={selectedBlockIndex}
                availableMembersOfSelection={availableMembersOfSelection}
                notAvailableMembersOfSelection={notAvailableMembersOfSelection}
                closeMobileDrawer={resetSelection}
            />

            <div className={`lg:hidden ${isMobileDrawerOpen ? "h-96" : ""}`} />
        </div>
    );
}
