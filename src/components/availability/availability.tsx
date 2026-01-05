"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { GroupAvailability } from "@/components/availability/group-availability";
import { GroupResponses } from "@/components/availability/group-responses";
import { AvailabilityHeader } from "@/components/availability/header/availability-header";
import { PersonalAvailability } from "@/components/availability/personal-availability";
import { AvailabilityNavButton } from "@/components/availability/table/availability-nav-button";
import { AvailabilityTableHeader } from "@/components/availability/table/availability-table-header";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { SelectMeeting } from "@/db/schema";
import { useEditState } from "@/hooks/use-edit-state";
import { UserProfile } from "@/lib/auth/user";
import {
    convertTimeFromUTC,
    generateTimeBlocks,
    getTimeFromHourMinuteString,
} from "@/lib/availability/utils";
import type {
    GoogleCalendarEvent,
    MemberMeetingAvailability,
} from "@/lib/types/availability";
import type { HourMinuteString } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";
import { useGroupSelectionStore } from "@/store/useGroupSelectionStore";
import { fetchGoogleCalendarEvents } from "@actions/availability/google/calendar/action";
import { useShallow } from "zustand/shallow";

// Helper function to derive initial availability data
const deriveInitialAvailability = ({
    timezone,
    meetingDates,
    userAvailability,
    allAvailabilties,
    availabilityTimeBlocks,
}: {
    timezone: string;
    meetingDates: string[];
    userAvailability: MemberMeetingAvailability | null;
    allAvailabilties: MemberMeetingAvailability[];
    availabilityTimeBlocks: number[];
}) => {
    const availabilitiesByDate = new Map<string, string[]>();
    if (userAvailability?.meetingAvailabilities) {
        userAvailability.meetingAvailabilities.forEach((timeStr) => {
            // Convert UTC timestamp to local date to get the correct day
            const localDate = new Date(timeStr);
            const dateStr = localDate.toLocaleDateString("en-CA"); // YYYY-MM-DD format

            if (!availabilitiesByDate.has(dateStr)) {
                availabilitiesByDate.set(dateStr, []);
            }

            availabilitiesByDate.get(dateStr)?.push(timeStr);
        });
    }

    const timestampsByDate = new Map<string, Map<string, string[]>>();
    for (const member of allAvailabilties) {
        for (const timestamp of member.meetingAvailabilities) {
            // Convert UTC timestamp to local date to get the correct day
            const localDate = new Date(timestamp);
            const dateStr = localDate.toLocaleDateString("en-CA"); // YYYY-MM-DD format

            if (!timestampsByDate.has(dateStr)) {
                timestampsByDate.set(dateStr, new Map());
            }
            const dateMap = timestampsByDate.get(dateStr)!;
            if (!dateMap.has(timestamp)) {
                dateMap.set(timestamp, []);
            }
            dateMap.get(timestamp)?.push(member.memberId);
        }
    }

    const initialAvailability = meetingDates
        .map((meetingDate) => {
            // Extract the date part and create a Date object in LOCAL timezone
            const dateStr = meetingDate.split("T")[0];
            const [year, month, day] = dateStr.split("-").map(Number);
            // Create date at midnight in LOCAL timezone
            const date = new Date(year, month - 1, day);

            const earliestMinutes = availabilityTimeBlocks[0] || 480;
            const latestMinutes =
                (availabilityTimeBlocks[availabilityTimeBlocks.length - 1] ||
                    1035) + 15;

            const dateAvailabilities = availabilitiesByDate.get(dateStr) || [];

            const dateGroupAvailabilities = Object.fromEntries(
                timestampsByDate.get(dateStr) || new Map()
            );
            return new ZotDate(
                date,
                earliestMinutes,
                latestMinutes,
                false,
                dateAvailabilities,
                dateGroupAvailabilities
            );
        })
        .sort((a, b) => a.day.getTime() - b.day.getTime());

    return initialAvailability;
};

export function Availability({
    meetingData,
    userAvailability,
    allAvailabilities,
    user,
}: {
    meetingData: SelectMeeting;
    userAvailability: MemberMeetingAvailability | null;
    allAvailabilities: MemberMeetingAvailability[];
    user: UserProfile | null;
}) {
    const availabilityView = useAvailabilityViewStore(
        (state) => state.availabilityView
    );

    const selectionIsLocked = useGroupSelectionStore(
        (state) => state.selectionIsLocked
    );
    const resetSelection = useGroupSelectionStore(
        (state) => state.resetSelection
    );
    const setIsMobileDrawerOpen = useGroupSelectionStore(
        (state) => state.setIsMobileDrawerOpen
    );

    const handleMouseLeave = useCallback(() => {
        if (availabilityView === "group" && !selectionIsLocked) {
            setIsMobileDrawerOpen(false);
            resetSelection();
        }
    }, [
        availabilityView,
        selectionIsLocked,
        setIsMobileDrawerOpen,
        resetSelection,
    ]);

    const { currentPage, itemsPerPage, isFirstPage, nextPage, prevPage } =
        useAvailabilityPaginationStore(
            useShallow((state) => ({
                currentPage: state.currentPage,
                itemsPerPage: state.itemsPerPage,
                isFirstPage: state.isFirstPage,
                nextPage: state.nextPage,
                prevPage: state.prevPage,
            }))
        );
    const isLastPage =
        currentPage ===
        Math.floor((meetingData.dates.length - 1) / itemsPerPage);

    // Convert UTC times to user's local timezone for display
    const userTimezone = useMemo(
        () => Intl.DateTimeFormat().resolvedOptions().timeZone,
        []
    );
    const referenceDate = meetingData.dates[0];

    const fromTimeLocal = useMemo(
        () =>
            convertTimeFromUTC(
                meetingData.fromTime,
                userTimezone,
                referenceDate
            ),
        [meetingData.fromTime, userTimezone, referenceDate]
    );
    const toTimeLocal = useMemo(
        () =>
            convertTimeFromUTC(meetingData.toTime, userTimezone, referenceDate),
        [meetingData.toTime, userTimezone, referenceDate]
    );

    const fromTimeMinutes = getTimeFromHourMinuteString(
        fromTimeLocal as HourMinuteString
    );
    const toTimeMinutes = getTimeFromHourMinuteString(
        toTimeLocal as HourMinuteString
    );
    const availabilityTimeBlocks = useMemo(
        () => generateTimeBlocks(fromTimeMinutes, toTimeMinutes),
        [fromTimeMinutes, toTimeMinutes]
    );
    const [googleCalendarEvents, setGoogleCalendarEvents] = useState<
        GoogleCalendarEvent[]
    >([]);

    const [availabilityDates, setAvailabilityDates] = useState(() =>
        deriveInitialAvailability({
            timezone: userTimezone,
            meetingDates: meetingData.dates,
            userAvailability,
            allAvailabilties: allAvailabilities,
            availabilityTimeBlocks,
        })
    );

    const { cancelEdit, confirmSave } = useEditState({
        currentAvailabilityDates: availabilityDates,
    });

    const lastPage = Math.floor((availabilityDates.length - 1) / itemsPerPage);

    const numPaddingDates =
        availabilityDates.length % itemsPerPage === 0
            ? 0
            : itemsPerPage - (availabilityDates.length % itemsPerPage);

    const datesToOffset = currentPage * itemsPerPage;

    const currentPageAvailability = useMemo(() => {
        let pageAvailability = availabilityDates.slice(
            datesToOffset,
            datesToOffset + itemsPerPage
        );

        if (currentPage === lastPage) {
            pageAvailability = pageAvailability.concat(
                new Array(numPaddingDates).fill(null)
            );
        }

        return pageAvailability;
    }, [
        availabilityDates,
        datesToOffset,
        itemsPerPage,
        currentPage,
        lastPage,
        numPaddingDates,
    ]);

    const handleUserAvailabilityChange = useCallback(
        (updatedDates: ZotDate[]) => {
            setAvailabilityDates(updatedDates);
        },
        [setAvailabilityDates]
    );
    const handleCancelEditing = useCallback(() => {
        const originalDates = cancelEdit();
        setAvailabilityDates(originalDates);
    }, [cancelEdit, setAvailabilityDates]);

    const handleSuccessfulSave = useCallback(() => {
        confirmSave();
    }, [confirmSave]);

    useEffect(() => {
        if (availabilityDates.length > 0) {
            const firstDateISO = availabilityDates[0].day.toISOString();

            const lastZotDate = availabilityDates[availabilityDates.length - 1];
            const lastDateObj = new Date(lastZotDate.day);
            lastDateObj.setHours(23, 59, 59, 999);
            const lastDateISO = lastDateObj.toISOString();

            fetchGoogleCalendarEvents(firstDateISO, lastDateISO)
                .then((events) => {
                    setGoogleCalendarEvents(events);
                })
                .catch((error) => {
                    console.error(
                        "Error fetching Google Calendar events:",
                        error
                    );
                    setGoogleCalendarEvents([]);
                });
        } else {
            setGoogleCalendarEvents([]);
        }
    }, [availabilityDates]);

    const members = useMemo(() => {
        const presentMemberIds = [
            ...new Set(
                availabilityDates.flatMap((date) =>
                    Object.values(date.groupAvailability).flat()
                )
            ),
        ];

        const allMembers = [
            ...new Set(allAvailabilities.map((member) => member.memberId)),
        ].map((memberId) => {
            const member = allAvailabilities.find(
                (m) => m.memberId === memberId
            );
            return {
                memberId: member!.memberId,
                displayName: member!.displayName,
            };
        });

        if (
            user &&
            presentMemberIds.includes(user.memberId) &&
            !allMembers.some((member) => member.memberId === user.memberId)
        ) {
            allMembers.push(user);
        }

        return allMembers;
    }, [allAvailabilities, availabilityDates, user]);

    return (
        <div className="space-y-6">
            <AvailabilityHeader
                meetingData={meetingData}
                user={user}
                availabilityDates={availabilityDates}
                onCancel={handleCancelEditing}
                onSave={handleSuccessfulSave}
            />

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
                            meetingType={meetingData.meetingType}
                        />

                        <tbody onMouseLeave={handleMouseLeave}>
                            {availabilityTimeBlocks.map(
                                (timeBlock, blockIndex) => (
                                    <tr key={`block-${timeBlock}`}>
                                        <AvailabilityTimeTicks
                                            timeBlock={timeBlock}
                                        />

                                        {availabilityView === "group" ? (
                                            <GroupAvailability
                                                timeBlock={timeBlock}
                                                blockIndex={blockIndex}
                                                availabilityTimeBlocks={
                                                    availabilityTimeBlocks
                                                }
                                                fromTime={fromTimeMinutes}
                                                availabilityDates={
                                                    availabilityDates
                                                }
                                                currentPageAvailability={
                                                    currentPageAvailability
                                                }
                                                members={members}
                                                onMouseLeave={handleMouseLeave}
                                            />
                                        ) : (
                                            <PersonalAvailability
                                                timeBlock={timeBlock}
                                                blockIndex={blockIndex}
                                                availabilityTimeBlocks={
                                                    availabilityTimeBlocks
                                                }
                                                fromTime={fromTimeMinutes}
                                                availabilityDates={
                                                    availabilityDates
                                                }
                                                currentPageAvailability={
                                                    currentPageAvailability
                                                }
                                                googleCalendarEvents={
                                                    googleCalendarEvents
                                                }
                                                user={user}
                                                onAvailabilityChange={
                                                    handleUserAvailabilityChange
                                                }
                                            />
                                        )}
                                    </tr>
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
                    fromTime={fromTimeMinutes}
                    members={members}
                />
            </div>
        </div>
    );
}
