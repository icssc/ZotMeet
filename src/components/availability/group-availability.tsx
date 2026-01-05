"use client";

import React, { useCallback } from "react";
import { GroupAvailabilityBlock } from "@/components/availability/group-availability-block";
import { generateDateKey, spacerBeforeDate } from "@/lib/availability/utils";
import { Member } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";
import { useGroupSelectionStore } from "@/store/useGroupSelectionStore";
import { useShallow } from "zustand/shallow";

export const getTimestampFromBlockIndex = (
    blockIndex: number,
    zotDateIndex: number,
    fromTime: number,
    availabilityDates: ZotDate[]
) => {
    const minutesFromMidnight = fromTime + blockIndex * 15;
    const hours = Math.floor(minutesFromMidnight / 60);
    const minutes = minutesFromMidnight % 60;

    const selectedDate = availabilityDates.at(zotDateIndex);

    if (!selectedDate) {
        return "";
    }

    const date = new Date(selectedDate.day);
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    const isoString = date.toISOString();
    return isoString;
};

interface GroupAvailabilityProps {
    timeBlock: number;
    blockIndex: number;
    availabilityTimeBlocks: number[];
    fromTime: number;
    availabilityDates: ZotDate[];
    currentPageAvailability: ZotDate[];
    members: Member[];
    onMouseLeave: () => void;
}

export function GroupAvailability({
    timeBlock,
    blockIndex,
    availabilityTimeBlocks,
    fromTime,
    availabilityDates,
    currentPageAvailability,
    members,
    onMouseLeave,
}: GroupAvailabilityProps) {
    const { currentPage, itemsPerPage } = useAvailabilityPaginationStore(
        useShallow((state) => ({
            currentPage: state.currentPage,
            itemsPerPage: state.itemsPerPage,
        }))
    );

    const {
        selectedZotDateIndex,
        selectedBlockIndex,
        selectionIsLocked,
        hoveredMember,
        setSelectedZotDateIndex,
        setSelectedBlockIndex,
        setSelectionIsLocked,
        setIsMobileDrawerOpen,
    } = useGroupSelectionStore(
        useShallow((state) => ({
            selectedZotDateIndex: state.selectedZotDateIndex,
            selectedBlockIndex: state.selectedBlockIndex,
            selectionIsLocked: state.selectionIsLocked,
            hoveredMember: state.hoveredMember,
            setSelectedZotDateIndex: state.setSelectedZotDateIndex,
            setSelectedBlockIndex: state.setSelectedBlockIndex,
            setSelectionIsLocked: state.setSelectionIsLocked,
            setIsMobileDrawerOpen: state.setIsMobileDrawerOpen,
        }))
    );

    const updateSelection = useCallback(
        ({
            zotDateIndex,
            blockIndex,
        }: {
            zotDateIndex: number;
            blockIndex: number;
        }) => {
            setIsMobileDrawerOpen(true);
            setSelectedZotDateIndex(zotDateIndex);
            setSelectedBlockIndex(blockIndex);
        },
        [setIsMobileDrawerOpen, setSelectedZotDateIndex, setSelectedBlockIndex]
    );

    const handleCellClick = useCallback(
        ({
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
        },
        [selectionIsLocked, setSelectionIsLocked, updateSelection]
    );

    const handleCellHover = useCallback(
        ({
            zotDateIndex,
            blockIndex,
        }: {
            zotDateIndex: number;
            blockIndex: number;
        }) => {
            if (!selectionIsLocked) {
                updateSelection({ zotDateIndex, blockIndex });
            }
        },
        [selectionIsLocked, updateSelection]
    );

    const isTopOfHour = timeBlock % 60 === 0;
    const isHalfHour = timeBlock % 60 === 30;
    const isLastRow = blockIndex === availabilityTimeBlocks.length - 1;
    const numMembers = members.length;

    const spacers = spacerBeforeDate(currentPageAvailability);

    return currentPageAvailability.map((selectedDate, pageDateIndex) => {
        const key = generateDateKey({
            selectedDate,
            timeBlock,
            pageDateIndex,
        });

        if (selectedDate) {
            const zotDateIndex = pageDateIndex + currentPage * itemsPerPage;

            const isSelected =
                selectedZotDateIndex === zotDateIndex &&
                selectedBlockIndex === blockIndex;

            const timestamp = getTimestampFromBlockIndex(
                blockIndex,
                zotDateIndex,
                fromTime,
                availabilityDates
            );

            // Get the block (array of member IDs available at this timestamp)
            const block = selectedDate.groupAvailability[timestamp] || [];

            // Calculate block color
            let blockColor = "transparent";
            if (hoveredMember) {
                if (block.includes(hoveredMember)) {
                    blockColor = "rgba(55, 124, 251)";
                } else {
                    blockColor = "transparent";
                }
            } else if (numMembers > 0) {
                const opacity = block.length / numMembers;
                blockColor = `rgba(55, 124, 251, ${opacity})`;
            }

            const tableCellStyles = cn(
                isTopOfHour ? "border-t-[1px] border-t-gray-medium" : "",
                isHalfHour ? "border-t-[1px] border-t-gray-base" : "",
                isLastRow ? "border-b-[1px]" : "",
                isSelected ? "outline-dashed outline-2 outline-slate-500" : ""
            );

            return (
                <React.Fragment key={key}>
                    {spacers[pageDateIndex] && (
                        <td
                            className="w-3 md:w-4"
                            aria-hidden="true"
                        />
                    )}
                    <td className="px-0 py-0">
                        <GroupAvailabilityBlock
                            className="group-availability-block block"
                            onClick={() =>
                                handleCellClick({
                                    isSelected,
                                    zotDateIndex,
                                    blockIndex,
                                })
                            }
                            onHover={() =>
                                handleCellHover({
                                    zotDateIndex,
                                    blockIndex,
                                })
                            }
                            block={block}
                            blockColor={blockColor}
                            tableCellStyles={tableCellStyles}
                            hoveredMember={hoveredMember}
                            hasSpacerBefore={spacers[pageDateIndex]}
                        />
                    </td>
                </React.Fragment>
            );
        } else {
            return (
                // Because these elements are hidden spacers, we consider mouse hovers to be "leaving" the table
                <React.Fragment key={key}>
                    {spacers[pageDateIndex] && (
                        <td
                            className="w-3 md:w-4"
                            aria-hidden="true"
                            onMouseEnter={onMouseLeave}
                        />
                    )}
                    <td onMouseEnter={onMouseLeave}></td>
                </React.Fragment>
            );
        }
    });
}
