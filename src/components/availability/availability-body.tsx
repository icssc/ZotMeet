"use client";

import { useEffect, useMemo, useState } from "react";
import { AvailabilityHeader } from "@/components/availability/availability-header";
import { GroupAvailability } from "@/components/availability/group-availability";
import { PersonalAvailability } from "@/components/availability/personal-availability";
import { SelectMeeting } from "@/db/schema";
import { UserProfile } from "@/lib/auth/user";
import { getTimeFromHourMinuteString } from "@/lib/availability/utils";
import { MemberMeetingAvailability } from "@/lib/types/availability";
import { HourMinuteString } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";

// Helper function to derive initial availability data
const deriveInitialAvailability = ({
    meetingDates,
    userAvailability,
    allAvailabilties,
    availabilityTimeBlocks,
}: {
    meetingDates: string[];
    userAvailability: MemberMeetingAvailability | null;
    allAvailabilties: MemberMeetingAvailability[];
    availabilityTimeBlocks: number[];
}) => {
    // Create the availability map
    const availabilitiesByDate = new Map<string, string[]>();
    if (userAvailability?.meetingAvailabilities) {
        userAvailability.meetingAvailabilities.forEach((timeStr) => {
            const time = new Date(timeStr);
            const dateStr = time.toISOString().split("T")[0];
            if (!availabilitiesByDate.has(dateStr)) {
                availabilitiesByDate.set(dateStr, []);
            }
            availabilitiesByDate.get(dateStr)?.push(timeStr);
        });
    }

    // Generate timestamps by date
    const timestampsByDate = new Map<string, Map<string, string[]>>();
    for (const member of allAvailabilties) {
        for (const timestamp of member.meetingAvailabilities) {
            const date = timestamp.split("T")[0];
            if (!timestampsByDate.has(date)) {
                timestampsByDate.set(date, new Map());
            }
            const dateMap = timestampsByDate.get(date)!;
            if (!dateMap.has(timestamp)) {
                dateMap.set(timestamp, []);
            }
            dateMap.get(timestamp)!.push(member.memberId);
        }
    }

    // Generate ZotDates
    const zotDates = meetingDates
        .map((meetingDate) => {
            const date = new Date(meetingDate);
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

    return zotDates;
};

export function AvailabilityBody({
    meetingData,
    meetingDates,
    userAvailability,
    allAvailabilties,
    user,
}: {
    meetingData: SelectMeeting;
    meetingDates: string[];
    userAvailability: MemberMeetingAvailability | null;
    allAvailabilties: MemberMeetingAvailability[];
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
    const availabilityTimeBlocks = generateTimeBlocks(
        fromTimeMinutes,
        toTimeMinutes
    );

    // Initialize state with derived data
    const [availabilityDates, setAvailabilityDates] = useState(() => {
        const initialData = deriveInitialAvailability({
            meetingDates,
            userAvailability,
            allAvailabilties,
            availabilityTimeBlocks,
        });
        console.log("Initial availability data:", initialData);
        return initialData;
    });

    // Track original availability state for cancellation
    const [originalAvailabilityDates, setOriginalAvailabilityDates] = useState<
        ZotDate[]
    >([]);
    const [isEditingAvailability, setIsEditingAvailability] = useState(false);

    // Update original state when entering edit mode
    useEffect(() => {
        if (availabilityView === "personal" && !isEditingAvailability) {
            setOriginalAvailabilityDates(
                availabilityDates.map((date) => date.clone())
            );
            setIsEditingAvailability(true);
        }
    }, [availabilityView, isEditingAvailability, availabilityDates]);

    // Reset availability state to last saved state
    const resetAvailabilityState = () => {
        setAvailabilityDates(
            originalAvailabilityDates.map((date) => date.clone())
        );
        setIsEditingAvailability(false);
    };

    // Handle successful save
    const handleSaveSuccess = () => {
        setOriginalAvailabilityDates(
            availabilityDates.map((date) => date.clone())
        );
        setIsEditingAvailability(false);
    };

    // Calculate last page
    const lastPage = Math.floor((availabilityDates.length - 1) / itemsPerPage);

    // Calculate padding dates for the last page
    const numPaddingDates =
        availabilityDates.length % itemsPerPage === 0
            ? 0
            : itemsPerPage - (availabilityDates.length % itemsPerPage);

    // Calculate current page availability
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

    // Single useEffect for any necessary initial setup
    useEffect(() => {
        if (userAvailability) {
            setHasAvailability(true);
        }
    }, [setHasAvailability, userAvailability]);

    // Handler to update user availability
    const handleUserAvailabilityChange = (updatedDates: ZotDate[]) => {
        setAvailabilityDates(updatedDates);
    };

    return (
        <div className={"space-y-6 px-6"}>
            <AvailabilityHeader
                meetingData={meetingData}
                user={user}
                availabilityDates={availabilityDates}
                onCancel={resetAvailabilityState}
                onSaveSuccess={handleSaveSuccess}
            />
            {availabilityView === "group" ? (
                <GroupAvailability
                    availabilityTimeBlocks={availabilityTimeBlocks}
                    groupAvailabilities={allAvailabilties}
                    fromTime={fromTimeMinutes}
                    availabilityDates={availabilityDates}
                    currentPageAvailability={currentPageAvailability}
                />
            ) : (
                <PersonalAvailability
                    fromTime={fromTimeMinutes}
                    userAvailability={userAvailability}
                    availabilityTimeBlocks={availabilityTimeBlocks}
                    availabilityDates={availabilityDates}
                    currentPageAvailability={currentPageAvailability}
                    onAvailabilityChange={handleUserAvailabilityChange}
                />
            )}
        </div>
    );
}

const BLOCK_LENGTH: number = 15;

const generateTimeBlocks = (startTime: number, endTime: number): number[] => {
    const timeBlocks: number[] = [];
    const minuteRange = Math.abs(endTime - startTime);
    const totalBlocks = Math.floor(minuteRange / BLOCK_LENGTH);

    for (let blockIndex = 0; blockIndex < totalBlocks; blockIndex++) {
        timeBlocks.push(startTime + blockIndex * BLOCK_LENGTH);
    }
    return timeBlocks;
};
