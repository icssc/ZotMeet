"use client";

import React, { useCallback, useEffect, useState } from "react";
import { GroupAvailabilityRow } from "@/components/availability/group-availability-row";
import { Member } from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";

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
    availabilityTimeBlocks: number[];
    fromTime: number;
    availabilityDates: ZotDate[];
    currentPageAvailability: ZotDate[];
    members: Member[];
}

export function GroupAvailability({
    availabilityTimeBlocks,
    fromTime,
    availabilityDates,
    currentPageAvailability,
    members,
}: GroupAvailabilityProps) {
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [selectedZotDateIndex, setSelectedZotDateIndex] = useState<number>();
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>();
    const [selectionIsLocked, setSelectionIsLocked] = useState(false);
    const [hoveredMember, setHoveredMember] = useState<string | null>(null);

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
        []
    );

    const resetSelection = useCallback(() => {
        setIsMobileDrawerOpen(false);
        setSelectedZotDateIndex(undefined);
        setSelectedBlockIndex(undefined);
        setHoveredMember(null);
    }, []);

    // const { availableMembers, notAvailableMembers } = useMemo(() => {
    //     if (
    //         selectedZotDateIndex === undefined ||
    //         selectedBlockIndex === undefined
    //     ) {
    //         return {
    //             availableMembers: [],
    //             notAvailableMembers: members,
    //         };
    //     }

    //     const selectedDate = availabilityDates[selectedZotDateIndex];
    //     const timestamp = getTimestampFromBlockIndex(
    //         selectedBlockIndex,
    //         selectedZotDateIndex,
    //         fromTime,
    //         availabilityDates
    //     );

    //     const availableMemberIds =
    //         selectedDate.groupAvailability[timestamp] || [];

    //     return {
    //         availableMembers: members.filter((member) =>
    //             availableMemberIds.includes(member.memberId)
    //         ),
    //         notAvailableMembers: members.filter(
    //             (member) => !availableMemberIds.includes(member.memberId)
    //         ),
    //     };
    // }, [
    //     selectedZotDateIndex,
    //     selectedBlockIndex,
    //     availabilityDates,
    //     fromTime,
    //     members,
    // ]);

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
        [selectionIsLocked, updateSelection]
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
                resetSelection();
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            const isOnAvailabilityBlock = !!target.closest(
                ".group-availability-block"
            );

            if (!isOnAvailabilityBlock) {
                resetSelection();
                setSelectionIsLocked(false);
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectionIsLocked, resetSelection]);

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                resetSelection();
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
    }, [resetSelection]);

    // const handleMemberHover = (memberId: string | null) => {
    //     if (memberId === null) {
    //         setHoveredMember(null);
    //         return;
    //     }

    //     const member = members.find((m) => m.memberId === memberId);
    //     setHoveredMember(member ? member.displayName : null);
    // };

    return availabilityTimeBlocks.map((timeBlock, blockIndex) => (
        <GroupAvailabilityRow
            key={`block-${timeBlock}`}
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
    ));
}

{
    /* <GroupResponses
    availabilityDates={availabilityDates}
    isMobileDrawerOpen={isMobileDrawerOpen}
    selectedZotDateIndex={selectedZotDateIndex}
    selectedBlockIndex={selectedBlockIndex}
    availableMembersOfSelection={availableMembers}
    notAvailableMembersOfSelection={notAvailableMembers}
    closeMobileDrawer={resetSelection}
    onMemberHover={handleMemberHover}
/>

<div
    className={cn("lg:hidden", {
        "h-96": isMobileDrawerOpen,
    })}
/> */
}
