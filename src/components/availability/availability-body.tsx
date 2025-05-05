"use client";

import { useEffect, useState } from "react";
import { AvailabilityHeader } from "@/components/availability/availability-header";
import { useAvailabilityContext } from "@/components/availability/context/availability-context";
import { GroupAvailability } from "@/components/availability/group-availability";
import { PersonalAvailability } from "@/components/availability/personal-availability";
import { SelectMeeting } from "@/db/schema";
import { UserProfile } from "@/lib/auth/user";
import { getTimeFromHourMinuteString } from "@/lib/availability/utils";
import { MemberMeetingAvailability } from "@/lib/types/availability";
import { HourMinuteString } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";
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
    const timestampsByDate: Record<string, Record<string, string[]>> = {};
    for (const member of allAvailabilties) {
        for (const timestamp of member.meetingAvailabilities) {
            const date = timestamp.split("T")[0];
            if (!timestampsByDate[date]) {
                timestampsByDate[date] = {};
            }
            if (!timestampsByDate[date][timestamp]) {
                timestampsByDate[date][timestamp] = [];
            }
            timestampsByDate[date][timestamp].push(member.memberId);
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
            const dateGroupAvailabilities = timestampsByDate[dateStr] || {};

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

    // For the first page of availability
    const itemsPerPage = 5; // We can make this configurable later
    const currentPageAvailability = zotDates.slice(0, itemsPerPage);

    return {
        availabilityDates: zotDates,
        currentPageAvailability,
        itemsPerPage,
    };
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
    const fromTimeNumber =
        getTimeFromHourMinuteString(meetingData.fromTime as HourMinuteString) /
        60;
    const toTimeNumber =
        getTimeFromHourMinuteString(meetingData.toTime as HourMinuteString) /
        60;
    const availabilityTimeBlocks = generateTimeBlocks(
        fromTimeNumber,
        toTimeNumber
    );

    console.log("Initial availabilityTimeBlocks:", availabilityTimeBlocks);

    // Initialize state with derived data
    const [availability, setAvailability] = useState(() => {
        const initialData = deriveInitialAvailability({
            meetingDates,
            userAvailability,
            allAvailabilties,
            availabilityTimeBlocks,
        });
        console.log("Initial availability data:", initialData);
        return initialData;
    });

    // Add pagination state
    const [currentPage, setCurrentPage] = useState(0);

    // Calculate last page
    const lastPage = Math.floor(
        (availability.availabilityDates.length - 1) / availability.itemsPerPage
    );

    // Calculate padding dates for the last page
    const numPaddingDates =
        availability.availabilityDates.length % availability.itemsPerPage === 0
            ? 0
            : availability.itemsPerPage -
              (availability.availabilityDates.length %
                  availability.itemsPerPage);

    // Handle page changes
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

    // Update current page availability whenever page changes
    useEffect(() => {
        const startIdx = currentPage * availability.itemsPerPage;
        let pageAvailability = availability.availabilityDates.slice(
            startIdx,
            startIdx + availability.itemsPerPage
        );

        // Add padding for last page
        if (currentPage === lastPage && numPaddingDates > 0) {
            pageAvailability = pageAvailability.concat(
                new Array(numPaddingDates).fill(null)
            );
        }

        console.log("Current page availability:", pageAvailability);
        setAvailability((prev) => ({
            ...prev,
            currentPageAvailability: pageAvailability,
        }));
    }, [currentPage, availability.itemsPerPage, numPaddingDates, lastPage]);

    // Single useEffect for any necessary initial setup
    useEffect(() => {
        if (userAvailability) {
            setHasAvailability(true);
        }
    }, [setHasAvailability, userAvailability]);

    console.log("availabilityTimeBlocks", availabilityTimeBlocks); // Properly generated
    console.log("meetingDates", meetingDates);
    console.log("groupAvailabilities", allAvailabilties);
    console.log("userAvailability", userAvailability);
    console.log("fromTimeNumber, toTimeNumber", fromTimeNumber, toTimeNumber); // Not properly generated, should generate array of ZotDates, but currently generates nothing.

    console.log("Rendering with:", {
        availabilityTimeBlocks,
        currentPageAvailability: availability.currentPageAvailability,
        availabilityDates: availability.availabilityDates,
    });

    // Handler to update user availability
    const handleUserAvailabilityChange = (updatedDates: ZotDate[]) => {
        setAvailability((prev) => ({
            ...prev,
            availabilityDates: updatedDates,
            currentPageAvailability: updatedDates.slice(
                currentPage * prev.itemsPerPage,
                (currentPage + 1) * prev.itemsPerPage
            ),
        }));
    };

    return (
        <div className={"space-y-6 px-6"}>
            <AvailabilityHeader
                meetingData={meetingData}
                user={user}
                availabilityDates={availability.availabilityDates}
            />
            {availabilityView === "group" ? (
                <GroupAvailability
                    availabilityTimeBlocks={availabilityTimeBlocks}
                    groupAvailabilities={allAvailabilties}
                    fromTime={fromTimeNumber}
                    toTime={toTimeNumber}
                    availabilityDates={availability.availabilityDates}
                    currentPageAvailability={
                        availability.currentPageAvailability
                    }
                    itemsPerPage={availability.itemsPerPage}
                    currentPage={currentPage}
                    onPrevPage={handlePrevPage}
                    onNextPage={handleNextPage}
                    isFirstPage={currentPage === 0}
                    isLastPage={currentPage === lastPage}
                />
            ) : (
                <PersonalAvailability
                    fromTime={fromTimeNumber}
                    meetingDates={meetingDates}
                    userAvailability={userAvailability}
                    availabilityTimeBlocks={availabilityTimeBlocks}
                    availabilityDates={availability.availabilityDates}
                    currentPageAvailability={
                        availability.currentPageAvailability
                    }
                    itemsPerPage={availability.itemsPerPage}
                    currentPage={currentPage}
                    onPrevPage={handlePrevPage}
                    onNextPage={handleNextPage}
                    isFirstPage={currentPage === 0}
                    isLastPage={currentPage === lastPage}
                    onAvailabilityChange={handleUserAvailabilityChange}
                />
            )}
        </div>
    );
}

const BLOCK_LENGTH: number = 15;

const generateTimeBlocks = (startTime: number, endTime: number): number[] => {
    const timeBlocks: number[] = [];
    const startMinutes = startTime * 60; // Convert hours to minutes
    const endMinutes = endTime * 60; // Convert hours to minutes
    const minuteRange = endMinutes - startMinutes;
    const totalBlocks = Math.floor(minuteRange / BLOCK_LENGTH);

    for (let blockIndex = 0; blockIndex < totalBlocks; blockIndex++) {
        timeBlocks.push(startMinutes + blockIndex * BLOCK_LENGTH);
    }
    return timeBlocks;
};
