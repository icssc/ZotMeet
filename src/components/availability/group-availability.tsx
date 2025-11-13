"use client";

import React, { useCallback, useEffect } from "react";
import { GroupAvailabilityRow } from "@/components/availability/group-availability-row";
import { Member } from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";
import { useGroupSelectionStore } from "@/store/useGroupSelectionStore";

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
}

export function GroupAvailability({
    timeBlock,
    blockIndex,
    availabilityTimeBlocks,
    fromTime,
    availabilityDates,
    currentPageAvailability,
    members,
}: GroupAvailabilityProps) {
    const {
        selectedZotDateIndex,
        selectedBlockIndex,
        setSelectedZotDateIndex,
        setSelectedBlockIndex,
        selectionIsLocked,
        setSelectionIsLocked,
        hoveredMember,
        resetSelection,
        setIsMobileDrawerOpen,
    } = useGroupSelectionStore();

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

    const resetSelectionWithDrawer = useCallback(() => {
        setIsMobileDrawerOpen(false);
        resetSelection();
    }, [resetSelection, setIsMobileDrawerOpen]);

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

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (selectionIsLocked) {
                return;
            }

            const gridBlocks = document.querySelectorAll(
                ".group-availability-block"
            );
            if (gridBlocks.length === 0) {
                return;
            }

            let isOverGrid = false;
            for (const block of gridBlocks) {
                const rect = block.getBoundingClientRect();
                if (
                    event.clientX >= rect.left &&
                    event.clientX <= rect.right &&
                    event.clientY >= rect.top &&
                    event.clientY <= rect.bottom
                ) {
                    isOverGrid = true;
                    break;
                }
            }

            if (!isOverGrid) {
                resetSelectionWithDrawer();
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            const isOnAvailabilityBlock = !!target.closest(
                ".group-availability-block"
            );

            if (!isOnAvailabilityBlock) {
                resetSelectionWithDrawer();
                setSelectionIsLocked(false);
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectionIsLocked, resetSelectionWithDrawer, setSelectionIsLocked]);

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                resetSelectionWithDrawer();
                setSelectionIsLocked(false);
                // Removes focused outline from previously selected block
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
            }
        };

        document.addEventListener("keydown", handleEscKey);
        return () => {
            document.removeEventListener("keydown", handleEscKey);
        };
    }, [resetSelectionWithDrawer, setSelectionIsLocked]);

    return (
        <GroupAvailabilityRow
            timeBlock={timeBlock}
            blockIndex={blockIndex}
            availabilityTimeBlocksLength={availabilityTimeBlocks.length}
            currentPageAvailability={currentPageAvailability}
            selectedZotDateIndex={selectedZotDateIndex}
            selectedBlockIndex={selectedBlockIndex}
            fromTime={fromTime}
            availabilityDates={availabilityDates}
            numMembers={members.length}
            hoveredMember={hoveredMember}
            handleCellClick={handleCellClick}
            handleCellHover={handleCellHover}
        />
    );
}
