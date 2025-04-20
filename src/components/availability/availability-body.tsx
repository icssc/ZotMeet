"use client";

import { useEffect } from "react";
import { useAvailabilityContext } from "@/components/availability/context/availability-context";
import { GroupAvailability } from "@/components/availability/group-availability";
import { PersonalAvailability } from "@/components/availability/personal-availability";
import { SelectMeeting } from "@/db/schema";
import { getTimeFromHourMinuteString } from "@/lib/availability/utils";
import { MemberMeetingAvailability } from "@/lib/types/availability";
import { HourMinuteString } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";

export function AvailabilityBody({
    meetingData,
    meetingDates,
    userAvailability,
    allAvailabilties,
}: {
    meetingData: SelectMeeting;
    meetingDates: string[];
    userAvailability: MemberMeetingAvailability | null;
    allAvailabilties: MemberMeetingAvailability[];
}) {
    const { availabilityView, setHasAvailability } = useAvailabilityViewStore();
    const { availabilityDates, setAvailabilityDates } =
        useAvailabilityContext();

    useEffect(() => {
        if (userAvailability) {
            setHasAvailability(true);
        }
    }, [setHasAvailability, userAvailability]);

    const availabilityTimeBlocks = generateTimeBlocks(
        getTimeFromHourMinuteString(meetingData.fromTime as HourMinuteString),
        getTimeFromHourMinuteString(meetingData.toTime as HourMinuteString)
    );

    const fromTimeNumber =
        parseInt(meetingData.fromTime.substring(0, 2), 10) +
        parseInt(meetingData.fromTime.substring(3, 5), 10) / 60;
    const toTimeNumber =
        parseInt(meetingData.toTime.substring(0, 2), 10) +
        parseInt(meetingData.toTime.substring(3, 5), 10) / 60;

    useEffect(() => {
        if (!meetingDates || meetingDates.length === 0) return;

        const availabilitiesByDate = new Map<string, string[]>();

        // Only populate the map if the availability object exists and has time blocks
        if (userAvailability && userAvailability.meetingAvailabilities) {
            userAvailability.meetingAvailabilities.forEach((timeStr) => {
                const time = new Date(timeStr);
                const dateStr = time.toISOString().split("T")[0]; // Get just the date part

                if (!availabilitiesByDate.has(dateStr)) {
                    availabilitiesByDate.set(dateStr, []);
                }

                availabilitiesByDate.get(dateStr)?.push(timeStr);
            });
        }

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
                timestampsByDate[date][timestamp].push(member.displayName);
            }
        }

        // For every meeting date, create a corresponding ZotDate object
        const convertedDates = meetingDates.map((meetingDate) => {
            const date = new Date(meetingDate);
            const dateStr = date.toISOString().split("T")[0];

            // TODO: Refactor this logic for new date string format.
            // Choose default bounds if no availabilityTimeBlocks exist
            const earliestMinutes =
                availabilityTimeBlocks.length > 0
                    ? availabilityTimeBlocks[0]
                    : 480;

            const latestMinutes =
                availabilityTimeBlocks.length > 0
                    ? availabilityTimeBlocks[
                          availabilityTimeBlocks.length - 1
                      ] + 15
                    : 1050;

            // Load the availability time strings for this date or use empty array
            const dateAvailabilities = availabilitiesByDate.get(dateStr) || [];
            const dateGroupAvailabilities = timestampsByDate[dateStr] || {};

            // console.log("date", dateGroupAvailabilities);

            // Create the ZotDate with any found availabilities
            const zotDate = new ZotDate(
                date,
                earliestMinutes,
                latestMinutes,
                false,
                dateAvailabilities,
                dateGroupAvailabilities
            );

            return zotDate;
        });

        setAvailabilityDates(convertedDates);
    }, [
        userAvailability,
        meetingDates,
        setAvailabilityDates,
        // TODO: fix this useEffect nonsense — availabilityTimeBlocks should be in the dependency array, but it breaks selection if it is
        // availabilityTimeBlocks,
        availabilityDates.length, // TODO: May cause problems
    ]);

    return (
        <div className={"space-y-6 px-6"}>
            {availabilityView === "group" ? (
                <GroupAvailability
                    availabilityTimeBlocks={availabilityTimeBlocks}
                    groupAvailabilities={allAvailabilties}
                    fromTime={fromTimeNumber}
                    toTime={toTimeNumber}
                />
            ) : (
                <PersonalAvailability
                    meetingDates={meetingDates}
                    userAvailability={userAvailability}
                    availabilityTimeBlocks={availabilityTimeBlocks}
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
