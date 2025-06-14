"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { GroupAvailability } from "@/components/availability/group-availability";
import { AvailabilityHeader } from "@/components/availability/header/availability-header";
import { PersonalAvailability } from "@/components/availability/personal-availability";
import { SelectMeeting } from "@/db/schema";
import { useEditState } from "@/hooks/use-edit-state";
import { UserProfile } from "@/lib/auth/user";
import {
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
import { fetchGoogleCalendarEvents } from "@actions/availability/google/calendar/action";
import { toZonedTime } from "date-fns-tz";

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
            const dateStr = timeStr.split("T")[0];

            if (!availabilitiesByDate.has(dateStr)) {
                availabilitiesByDate.set(dateStr, []);
            }

            availabilitiesByDate.get(dateStr)?.push(timeStr);
        });
    }

    const timestampsByDate = new Map<string, Map<string, string[]>>();
    for (const member of allAvailabilties) {
        for (const timestamp of member.meetingAvailabilities) {
            const dateStr = timestamp.split("T")[0];

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
            const date = toZonedTime(meetingDate, timezone);
            const dateStr = date.toISOString().split("T")[0];

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

export function AvailabilityBody({
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
    const { availabilityView, setHasAvailability } = useAvailabilityViewStore();
    const { currentPage, itemsPerPage } = useAvailabilityPaginationStore();

    const fromTimeMinutes = getTimeFromHourMinuteString(
        meetingData.fromTime as HourMinuteString
    );
    const toTimeMinutes = getTimeFromHourMinuteString(
        meetingData.toTime as HourMinuteString
    );
    const availabilityTimeBlocks = useMemo(
        () => generateTimeBlocks(fromTimeMinutes, toTimeMinutes),
        [fromTimeMinutes, toTimeMinutes]
    );
    const [googleCalendarEvents, setGoogleCalendarEvents] = useState<
        GoogleCalendarEvent[]
    >([]);

    const [availabilityDates, setAvailabilityDates] = useState(
        deriveInitialAvailability({
            timezone: meetingData.timezone,
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
        if (userAvailability) {
            setHasAvailability(true);
        }
    }, [setHasAvailability, userAvailability]);

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

            {availabilityView === "group" ? (
                <GroupAvailability
                    availabilityTimeBlocks={availabilityTimeBlocks}
                    fromTime={fromTimeMinutes}
                    availabilityDates={availabilityDates}
                    currentPageAvailability={currentPageAvailability}
                    members={members}
                />
            ) : (
                <PersonalAvailability
                    availabilityTimeBlocks={availabilityTimeBlocks}
                    fromTime={fromTimeMinutes}
                    availabilityDates={availabilityDates}
                    currentPageAvailability={currentPageAvailability}
                    googleCalendarEvents={googleCalendarEvents}
                    user={user}
                    onAvailabilityChange={handleUserAvailabilityChange}
                />
            )}
        </div>
    );
}
