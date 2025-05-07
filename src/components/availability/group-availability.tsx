"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAvailabilityContext } from "@/components/availability/context/availability-context";
import { GroupAvailabilityBlock } from "@/components/availability/group-availability-block";
import { GroupResponses } from "@/components/availability/group-responses";
import { AvailabilityNavButton } from "@/components/availability/table/availability-nav-button";
import { AvailabilityTableHeader } from "@/components/availability/table/availability-table-header";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { MemberMeetingAvailability } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";

export const getTimestampFromBlockIndex = (
    blockIndex: number,
    zotDateIndex: number,
    fromTime: number,
    availabilityDates: ZotDate[]
) => {
    const minutesFromMidnight = fromTime * 60 + blockIndex * 15;
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
    // console.log(`Block ${blockIndex} corresponds to time ${isoString}`);
    return isoString;
};

interface GroupAvailabilityProps {
    availabilityTimeBlocks: number[];
    groupAvailabilities: MemberMeetingAvailability[];
    fromTime: number;
    toTime: number;
}
export function GroupAvailability({
    availabilityTimeBlocks,
    groupAvailabilities,
    fromTime,
}: GroupAvailabilityProps) {
    const {
        currentPage,
        setCurrentPage,
        itemsPerPage,
        currentPageAvailability,
        setCurrentPageAvailability,
        availabilityDates,
    } = useAvailabilityContext();

    const lastPage = Math.floor((availabilityDates.length - 1) / itemsPerPage);
    const numPaddingDates =
        availabilityDates.length % itemsPerPage === 0
            ? 0
            : itemsPerPage - (availabilityDates.length % itemsPerPage);

    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [selectedZotDateIndex, setSelectedZotDateIndex] = useState<number>();
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>();
    const [availableMembersOfSelection, setAvailableMembersOfSelection] =
        useState<string[]>([]);
    const [notAvailableMembersOfSelection, setNotAvailableMembersOfSelection] =
        useState<string[]>([]);

    const [selectionIsLocked, setSelectionIsLocked] = useState(false);
    const [hoveredMember, setHoveredMember] = useState<string | null>(null);

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

    const resetSelection = useCallback(() => {
        setIsMobileDrawerOpen(false);
        setSelectedZotDateIndex(undefined);
        setSelectedBlockIndex(undefined);
    }, []);

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
            const timestamp = getTimestampFromBlockIndex(
                selectedBlockIndex,
                selectedZotDateIndex,
                fromTime,
                availabilityDates
            );

            const availableMemberIds =
                selectedDate.groupAvailability[timestamp] || [];
            
            const availableMemberNames = availableMemberIds.map(memberId => {
                const member = groupAvailabilities.find(m => m.memberId === memberId);
                return member?.displayName;
            }).filter(Boolean) as string[];
            setAvailableMembersOfSelection(availableMemberNames);

            const notAvailableMembers = groupAvailabilities.filter(
                (member) => !availableMemberIds.includes(member.memberId)
            );
            setNotAvailableMembersOfSelection(
                notAvailableMembers.map((member) => member.displayName)
            );
        }
    }, [
        setCurrentPageAvailability,
        selectedZotDateIndex,
        selectedBlockIndex,
        availabilityDates,
        groupAvailabilities,
        fromTime,
    ]);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (selectionIsLocked) return;
            
            const gridBlocks = document.querySelectorAll('.group-availability-block');
            if (gridBlocks.length === 0) return;
            
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
            const isOnAvailabilityBlock = !!target.closest('.group-availability-block');
            
            if (!isOnAvailabilityBlock) {
                resetSelection();
                setSelectionIsLocked(false);
            }
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectionIsLocked, resetSelection]);

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                resetSelection();
                setSelectionIsLocked(false);
                // Removes focused outline from previously selected block
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
            }
        };
        
        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, []);

    const handleMemberHover = (memberName: string | null) => {
        if (memberName === null) {
            setHoveredMember(null);
            return;
        }
        
        const member = groupAvailabilities.find(m => m.displayName === memberName);
        setHoveredMember(member ? member.memberId : null);
    };

    return (
        <div className="flex flex-row items-start justify-start align-top">
            <div 
                className="flex items-center justify-between overflow-x-auto h-fit font-dm-sans lg:w-full lg:pr-10"
            >
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
                                    {currentPageAvailability?.map(
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

                                                const isSelected =
                                                    selectedZotDateIndex ===
                                                        zotDateIndex &&
                                                    selectedBlockIndex ===
                                                        blockIndex;
                                                        
                                                const timestamp =
                                                    getTimestampFromBlockIndex(
                                                        blockIndex,
                                                        zotDateIndex,
                                                        fromTime,
                                                        availabilityDates
                                                    );
                                                
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
                                                            className="hidden lg:block group-availability-block"
                                                            timestamp={
                                                                timestamp
                                                            }
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
                                                                availabilityDates
                                                            }
                                                            tableCellStyles={
                                                                tableCellStyles
                                                            }
                                                            hoveredMember={hoveredMember}
                                                        />
                                                        <GroupAvailabilityBlock
                                                            timestamp={
                                                                timestamp
                                                            }
                                                            className="block lg:hidden group-availability-block"
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
                                                                availabilityDates
                                                            }
                                                            tableCellStyles={
                                                                tableCellStyles
                                                            }
                                                            hoveredMember={hoveredMember}
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
                onMemberHover={handleMemberHover}
            />

            <div className={`lg:hidden ${isMobileDrawerOpen ? "h-96" : ""}`} />
        </div>
    );
}