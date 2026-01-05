"use client";

import React, { useCallback } from "react";
import { GroupAvailabilityRow } from "@/components/availability/group-availability-row";
import { Member } from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";
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
            onMouseLeave={onMouseLeave}
        />
    );
}
