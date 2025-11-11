"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    groupAvailabilityHandlers,
    GroupAvailabilityRow,
} from "@/components/availability/group-availability-row";
import { GroupResponses } from "@/components/availability/group-responses";
import { AvailabilityNavButton } from "@/components/availability/table/availability-nav-button";
import { AvailabilityTableHeader } from "@/components/availability/table/availability-table-header";
import { Button } from "@/components/ui/button";
import { Member } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";
import { useBlockSelectionStore } from "@/store/useBlockSelectionStore";
import {
    getScheduledBlockTimes,
    saveMeetingSchedule,
} from "@actions/meeting/schedule/action";
import { CircleCheckIcon, CircleXIcon } from "lucide-react";
import { toast } from "sonner";

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
    meetingId: string;
    availabilityTimeBlocks: number[];
    fromTime: number;
    availabilityDates: ZotDate[];
    currentPageAvailability: ZotDate[];
    members: Member[];
    isSchedulingMeeting: boolean;
}

export function GroupAvailability({
    meetingId,
    availabilityTimeBlocks,
    fromTime,
    availabilityDates,
    currentPageAvailability,
    members,
    isSchedulingMeeting,
}: GroupAvailabilityProps) {
    const {
        startBlockSelection,
        setStartBlockSelection,
        endBlockSelection,
        setEndBlockSelection,
        selectionState,
        setSelectionState,
    } = useBlockSelectionStore();

    const { setAvailabilityView } = useAvailabilityViewStore();

    const { currentPage, itemsPerPage, nextPage, prevPage, isFirstPage } =
        useAvailabilityPaginationStore();
    console.log(`isSchedulingMeeting: ${isSchedulingMeeting}`);

    const isLastPage =
        currentPage ===
        Math.floor((availabilityDates.length - 1) / itemsPerPage);

    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [selectedZotDateIndex, setSelectedZotDateIndex] = useState<number>();
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>();
    const [selectionIsLocked, setSelectionIsLocked] = useState(false);
    const [hoveredMember, setHoveredMember] = useState<string | null>(null);

    const [scheduledFromTime, setScheduledFromTime] = useState<string | null>(
        null
    );
    const [scheduledToTime, setScheduledToTime] = useState<string | null>(null);
    const [scheduledDate, setScheduledDate] = useState<Date | null>(null);

    useEffect(() => {
        console.log("startBlockSelection changed:", startBlockSelection);
        console.log("endBlockSelection changed:", endBlockSelection);
        console.log("selectionState before setSelectionState:", selectionState);
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
            console.log("selectionState set to:", selectionState);
        }
    }, [startBlockSelection, endBlockSelection, setSelectionState]);

    useEffect(() => {
        async function fetchScheduledTimes() {
            try {
                const result = await getScheduledBlockTimes(meetingId);
                if (result) {
                    setScheduledFromTime(result.scheduledFromTime ?? null);
                    setScheduledToTime(result.scheduledToTime ?? null);
                    setScheduledDate(
                        result.scheduledDate
                            ? new Date(result.scheduledDate)
                            : null
                    );
                }
            } catch (error) {
                console.error("Error fetching scheduled block times:", error);
            }
        }

        fetchScheduledTimes();
    }, [meetingId]);

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

    // Helper to set store selection for scheduling mode (single contiguous range on same date)
    const setSchedulingSelection = useCallback(
        (zotDateIndex: number, startBlock: number, endBlock?: number) => {
            const s = { zotDateIndex, blockIndex: startBlock };
            const e = { zotDateIndex, blockIndex: endBlock ?? startBlock };
            setStartBlockSelection(s);
            setEndBlockSelection(e);
            setSelectionState({
                earlierDateIndex: zotDateIndex,
                laterDateIndex: zotDateIndex,
                earlierBlockIndex: Math.min(startBlock, endBlock ?? startBlock),
                laterBlockIndex: Math.max(startBlock, endBlock ?? startBlock),
            });
        },
        [setStartBlockSelection, setEndBlockSelection, setSelectionState]
    );

    const resetSelection = useCallback(() => {
        setIsMobileDrawerOpen(false);
        setSelectedZotDateIndex(undefined);
        setSelectedBlockIndex(undefined);
        setHoveredMember(null);

        // clear store
        setStartBlockSelection(undefined);
        setEndBlockSelection(undefined);
        setSelectionState(undefined);
    }, [setStartBlockSelection, setEndBlockSelection, setSelectionState]);

    const { availableMembers, notAvailableMembers } = useMemo(() => {
        if (
            selectedZotDateIndex === undefined ||
            selectedBlockIndex === undefined
        ) {
            return {
                availableMembers: [],
                notAvailableMembers: members,
            };
        }

        const selectedDate = availabilityDates[selectedZotDateIndex];
        const timestamp = getTimestampFromBlockIndex(
            selectedBlockIndex,
            selectedZotDateIndex,
            fromTime,
            availabilityDates
        );

        const availableMemberIds =
            selectedDate.groupAvailability[timestamp] || [];

        return {
            availableMembers: members.filter((member) =>
                availableMemberIds.includes(member.memberId)
            ),
            notAvailableMembers: members.filter(
                (member) => !availableMemberIds.includes(member.memberId)
            ),
        };
    }, [
        selectedZotDateIndex,
        selectedBlockIndex,
        availabilityDates,
        fromTime,
        members,
    ]);

    const handleCellClick = useCallback(
        ({
            zotDateIndex,
            blockIndex,
            isSelected,
        }: {
            isSelected: boolean;
            zotDateIndex: number;
            blockIndex: number;
        }) => {
            // Toggle off when clicking the same selected cell
            if (isSelected) {
                setSelectionIsLocked(false);
                // clear store
                setStartBlockSelection(undefined);
                setEndBlockSelection(undefined);
                setSelectionState(undefined);
                setSelectedZotDateIndex(undefined);
                setSelectedBlockIndex(undefined);
                return;
            }

            // Scheduling mode: set start (or finalize end if start exists on same date)
            if (isSchedulingMeeting) {
                // If a start exists on same date and selection not locked, finalize to create a contiguous range
                if (
                    startBlockSelection &&
                    startBlockSelection.zotDateIndex === zotDateIndex &&
                    !selectionIsLocked
                ) {
                    const start = startBlockSelection.blockIndex;
                    const end = blockIndex;
                    // ensure contiguous on same date by setting start/end normalized
                    setSchedulingSelection(
                        zotDateIndex,
                        Math.min(start, end),
                        Math.max(start, end)
                    );
                    setSelectionIsLocked(true);
                    setSelectedZotDateIndex(zotDateIndex);
                    setSelectedBlockIndex(Math.min(start, end));
                    return;
                }

                // Otherwise set start on this cell
                setSchedulingSelection(zotDateIndex, blockIndex, blockIndex);
                setSelectedZotDateIndex(zotDateIndex);
                setSelectedBlockIndex(blockIndex);
                setSelectionIsLocked(false);
                return;
            }

            // Default (non-scheduling) behavior
            setSelectionIsLocked(true);
            updateSelection({ zotDateIndex, blockIndex });
        },
        [
            selectionIsLocked,
            updateSelection,
            isSchedulingMeeting,
            startBlockSelection,
            setSchedulingSelection,
            setStartBlockSelection,
            setEndBlockSelection,
            setSelectionState,
        ]
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

            // if (!isOverGrid) {
            //     resetSelection();
            // }
        };

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            const isOnAvailabilityBlock = !!target.closest(
                ".group-availability-block"
            );

            if (!isOnAvailabilityBlock) {
                // resetSelection();
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

    const handleMemberHover = (memberId: string | null) => {
        if (memberId === null) {
            setHoveredMember(null);
            return;
        }

        const member = members.find((m) => m.memberId === memberId);
        setHoveredMember(member ? member.displayName : null);
    };

    const formatTimeForPg = (iso: string) => {
        const d = new Date(iso);
        // Get the local time in PT (Pacific Time), otherwise the golden doesn't show up
        const options = {
            timeZone: "America/Los_Angeles",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        } as const;
        const formatter = new Intl.DateTimeFormat("en-US", options);

        const parts = formatter.formatToParts(d);
        const timeParts = Object.fromEntries(
            parts.map((p) => [p.type, p.value])
        );
        return `${timeParts.hour}:${timeParts.minute}:${timeParts.second}`;
    };

    const saveScheduledSelection = async () => {
        if (!startBlockSelection || !endBlockSelection) {
            toast.error(
                "Please select a valid start and end time before saving."
            );
            return;
        }

        const scheduledFromTime = getTimestampFromBlockIndex(
            startBlockSelection.blockIndex,
            startBlockSelection.zotDateIndex,
            fromTime,
            availabilityDates
        );

        const scheduledToTime = getTimestampFromBlockIndex(
            endBlockSelection.blockIndex,
            endBlockSelection.zotDateIndex,
            fromTime,
            availabilityDates
        );

        if (!scheduledFromTime || !scheduledToTime) {
            toast.error("Invalid time selection — please try again.");
            return;
        }

        const scheduledDate = new Date(
            availabilityDates[startBlockSelection.zotDateIndex].day
        );

        try {
            const { success, error } = await saveMeetingSchedule({
                meetingId,
                scheduledFromTime: formatTimeForPg(scheduledFromTime),
                scheduledToTime: formatTimeForPg(scheduledToTime),
                scheduledDate: new Date(scheduledFromTime),
            });

            if (success) {
                toast.success("Meeting updated successfully!");
                window.location.reload();
            } else {
                toast.error(error ?? "Failed to update meeting.");
            }
        } catch (err) {
            console.error("Error saving meeting schedule:", err);
            toast.error("Unexpected error occurred while saving.");
        }
    };

    return (
        <div className="flex w-full flex-col">
            {/* --- Top bar: Cancel/Save buttons --- */}
            {isSchedulingMeeting && (
                <div className="mb-2 flex justify-end space-x-2 md:space-x-4">
                    <Button
                        className={cn(
                            "flex-center h-8 min-h-fit border-yellow-500 bg-white px-2 uppercase text-yellow-500 outline md:w-28 md:p-0",
                            "hover:border-yellow-500 hover:bg-yellow-500 hover:text-white"
                        )}
                        onClick={() => {
                            groupAvailabilityHandlers.handleCancel();
                            setAvailabilityView("group");
                        }}
                    >
                        <span className="hidden md:flex">Cancel</span>
                        <CircleXIcon />
                    </Button>

                    <Button
                        className={cn(
                            "flex-center h-8 min-h-fit border border-green-500 bg-white px-2 uppercase text-secondary md:w-24 md:p-0",
                            "group hover:border-green-500 hover:bg-green-500"
                        )}
                        type="button"
                        onClick={saveScheduledSelection}
                    >
                        <span className="hidden text-green-500 group-hover:text-white md:flex">
                            Save
                        </span>
                        <CircleCheckIcon className="text-green-500 group-hover:text-white" />
                    </Button>
                </div>
            )}

            {/* --- Main calendar + navigation + responses layout --- */}
            <div className="flex flex-row items-start justify-start align-top">
                <div className="flex h-fit items-center justify-between overflow-x-auto font-dm-sans lg:w-full lg:pr-14">
                    <AvailabilityNavButton
                        direction="left"
                        handleClick={prevPage}
                        disabled={isFirstPage}
                    />

                    <table className="w-full table-fixed">
                        <AvailabilityTableHeader
                            currentPageAvailability={currentPageAvailability}
                        />
                        <tbody>
                            {availabilityTimeBlocks.map(
                                (timeBlock, blockIndex) => (
                                    <GroupAvailabilityRow
                                        key={`block-${timeBlock}`}
                                        timeBlock={timeBlock}
                                        blockIndex={blockIndex}
                                        availabilityTimeBlocksLength={
                                            availabilityTimeBlocks.length
                                        }
                                        currentPageAvailability={
                                            currentPageAvailability
                                        }
                                        selectedZotDateIndex={
                                            selectedZotDateIndex
                                        }
                                        selectedBlockIndex={selectedBlockIndex}
                                        fromTime={fromTime}
                                        scheduledFromTime={scheduledFromTime}
                                        scheduledToTime={scheduledToTime}
                                        scheduledDate={scheduledDate}
                                        availabilityDates={availabilityDates}
                                        numMembers={members.length}
                                        hoveredMember={hoveredMember}
                                        handleCellClick={handleCellClick}
                                        handleCellHover={handleCellHover}
                                        isSchedulingMeeting={
                                            isSchedulingMeeting
                                        }
                                        selectionState={selectionState}
                                    />
                                )
                            )}
                        </tbody>
                    </table>

                    <AvailabilityNavButton
                        direction="right"
                        handleClick={() => nextPage(availabilityDates.length)}
                        disabled={isLastPage}
                    />
                </div>

                <GroupResponses
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
                />
            </div>
        </div>
    );
}
