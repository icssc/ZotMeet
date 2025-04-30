"use client";

import { useMemo, useState } from "react";
import { GroupAvailability } from "@/components/availability/group-availability";
import { PersonalAvailability } from "@/components/availability/personal-availability";
import { SelectMeeting } from "@/db/schema";
import { getTimeFromHourMinuteString } from "@/lib/availability/utils";
import { MemberMeetingAvailability } from "@/lib/types/availability";
import { HourMinuteString } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";

interface AvailabilityWrapperProps {
    meetingData: SelectMeeting;
    meetingDates: string[];
    userAvailability: MemberMeetingAvailability | null;
    allAvailabilties: MemberMeetingAvailability[];
}

export function AvailabilityWrapper({
    meetingData,
    meetingDates,
    userAvailability,
    allAvailabilties,
}: AvailabilityWrapperProps) {
    const { availabilityView, setHasAvailability } = useAvailabilityViewStore();
    const [availabilityDates, setAvailabilityDates] = useState<ZotDate[]>([]);

    // Derived values
    const availabilityTimeBlocks = useMemo(() => {
        return generateTimeBlocks(
            getTimeFromHourMinuteString(
                meetingData.fromTime as HourMinuteString
            ),
            getTimeFromHourMinuteString(meetingData.toTime as HourMinuteString)
        );
    }, [meetingData.fromTime, meetingData.toTime]);

    const fromTimeNumber = useMemo(() => {
        return (
            parseInt(meetingData.fromTime.substring(0, 2), 10) +
            parseInt(meetingData.fromTime.substring(3, 5), 10) / 60
        );
    }, [meetingData.fromTime]);

    const toTimeNumber = useMemo(() => {
        return (
            parseInt(meetingData.toTime.substring(0, 2), 10) +
            parseInt(meetingData.toTime.substring(3, 5), 10) / 60
        );
    }, [meetingData.toTime]);

    // Initialize availability dates
    useMemo(() => {
        if (!meetingDates || meetingDates.length === 0) return;

        const availabilitiesByDate = new Map<string, string[]>();
        if (userAvailability && userAvailability.meetingAvailabilities) {
            userAvailability.meetingAvailabilities.forEach((timeStr) => {
                const time = new Date(timeStr);
                const dateStr = time.toISOString().split("T")[0];
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
                timestampsByDate[date][timestamp].push(member.memberId);
            }
        }

        const convertedDates = meetingDates
            .map((meetingDate) => {
                const date = new Date(meetingDate);
                const dateStr = date.toISOString().split("T")[0];

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

                const dateAvailabilities =
                    availabilitiesByDate.get(dateStr) || [];
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

        setAvailabilityDates(convertedDates);
    }, [
        meetingDates,
        userAvailability,
        allAvailabilties,
        availabilityTimeBlocks,
    ]);

    // Set has availability flag
    useMemo(() => {
        if (userAvailability) {
            setHasAvailability(true);
        }
    }, [setHasAvailability, userAvailability]);

    return (
        <div className={"space-y-6 px-6"}>
            {availabilityView === "group" ? (
                <GroupAvailability
                    availabilityTimeBlocks={availabilityTimeBlocks}
                    groupAvailabilities={allAvailabilties}
                    fromTime={fromTimeNumber}
                    toTime={toTimeNumber}
                    availabilityDates={availabilityDates}
                    setAvailabilityDates={setAvailabilityDates}
                />
            ) : (
                <PersonalAvailability
                    fromTime={fromTimeNumber}
                    meetingDates={meetingDates}
                    userAvailability={userAvailability}
                    availabilityTimeBlocks={availabilityTimeBlocks}
                    availabilityDates={availabilityDates}
                    setAvailabilityDates={setAvailabilityDates}
                />
            )}
        </div>
    );
}

function generateTimeBlocks(startTime: number, endTime: number): number[] {
    const blocks: number[] = [];
    for (let i = startTime; i < endTime; i += 15) {
        blocks.push(i);
    }
    return blocks;
}
