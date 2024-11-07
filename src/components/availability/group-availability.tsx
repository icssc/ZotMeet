"use client";

import React, { useEffect, useState } from "react";
import { GroupAvailabilityBlock } from "@/components/availability/group-availability-block";
import { GroupResponses } from "@/components/availability/group-responses";
import { MemberAvailability } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";

interface GroupAvailabilityProps {
    columns: number;
    availabilityDates: ZotDate[];
    availabilityTimeBlocks: number[];
    groupAvailabilities: MemberAvailability[];
}

export function GroupAvailability({
    columns,
    availabilityDates,
    availabilityTimeBlocks,
    groupAvailabilities,
}: GroupAvailabilityProps) {
    const itemsPerPage = columns;
    const lastPage = Math.floor((availabilityDates.length - 1) / itemsPerPage);
    const numPaddingDates =
        availabilityDates.length % itemsPerPage === 0
            ? 0
            : itemsPerPage - (availabilityDates.length % itemsPerPage);

    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageAvailability, setCurrentPageAvailability] = useState<
        ZotDate[]
    >([]);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [selectedZotDateIndex, setSelectedZotDateIndex] = useState<number>();
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>();
    const [availableMembersOfSelection, setAvailableMembersOfSelection] =
        useState<string[]>([]);
    const [notAvailableMembersOfSelection, setNotAvailableMembersOfSelection] =
        useState<string[]>([]);
    const [selectionIsLocked, setSelectionIsLocked] = useState(false);

    // Update current page availability on pagination or data change
    useEffect(() => {
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
                    groupAvailabilities[availableMemberIndex].name
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

    return (
        <>
            <div className="font-dm-sans flex items-center justify-between overflow-x-auto lg:w-full lg:pr-10">
                <button
                    onClick={() => {
                        if (currentPage > 0) {
                            setCurrentPage(currentPage - 1);
                        }
                    }}
                    className="p-3 disabled:opacity-0 md:pl-1"
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
                            {currentPageAvailability.map(
                                (dateHeader, pageDateIndex) => (
                                    <th
                                        key={pageDateIndex}
                                        className="pb-2 text-sm font-normal"
                                    >
                                        {dateHeader ? (
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold uppercase text-gray-500 md:text-xs">
                                                    {dateHeader.day.toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            weekday: "short",
                                                        }
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
                                        ) : null}
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
                                        {isTopOfHour ? (
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
                                        ) : null}
                                    </td>

                                    {currentPageAvailability.map(
                                        (selectedDate, pageDateIndex) => {
                                            const key = generateDateKey({
                                                selectedDate,
                                                timeBlock,
                                                pageDateIndex,
                                            });

                                            if (selectedDate) {
                                                const zotDateIndex =
                                                    pageDateIndex +
                                                    currentPage * itemsPerPage;
                                                const availableMemberIndices =
                                                    selectedDate.getGroupAvailabilityBlock(
                                                        blockIndex
                                                    );
                                                const isSelected =
                                                    selectedZotDateIndex ===
                                                        zotDateIndex &&
                                                    selectedBlockIndex ===
                                                        blockIndex;
                                                const tableCellStyles = cn(
                                                    isTopOfHour &&
                                                        "border-t-gray-medium border-t-[1px]",
                                                    isHalfHour &&
                                                        "border-t-gray-base border-t-[1px]",
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
                        })}
                    </tbody>
                </table>

                <button
                    onClick={() => {
                        if (currentPage < lastPage) {
                            setCurrentPage(currentPage + 1);
                        }
                    }}
                    className="p-3 disabled:opacity-0 md:pr-1"
                    disabled={currentPage === lastPage}
                >
                    <span className="text-3xl text-gray-500">&rsaquo;</span>
                </button>
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
        </>
    );
}
