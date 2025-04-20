"use client";

import { useEffect } from "react";
import { GroupAvailability } from "@/components/availability/group-availability";
import { PersonalAvailability } from "@/components/availability/personal-availability";
import { SelectMeeting } from "@/db/schema";
import { UserProfile } from "@/lib/auth/user";
import {
    getTimeFromHourMinuteString,
    SAMPLE_MEMBERS,
} from "@/lib/availability/utils";
import { MemberMeetingAvailability } from "@/lib/types/availability";
import { HourMinuteString } from "@/lib/types/chrono";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";

export function AvailabilityBody({
    meetingData,
    meetingDates,
    userAvailability,
}: {
    meetingData: SelectMeeting;
    meetingDates: string[];
    userAvailability: MemberMeetingAvailability | null;
}) {
    const { availabilityView, setHasAvailability } = useAvailabilityViewStore(); // boop add a field for "dirtying"

    useEffect(() => {
        if (userAvailability) {
            setHasAvailability(true);
        }
    }, [setHasAvailability, userAvailability]);

    const availabilityTimeBlocks = generateTimeBlocks(
        getTimeFromHourMinuteString(meetingData.fromTime as HourMinuteString),
        getTimeFromHourMinuteString(meetingData.toTime as HourMinuteString)
    );

    return (
        <div className={"space-y-6 px-6"}>
            {availabilityView === "group" ? (
                <GroupAvailability
                    columns={5}
                    availabilityDates={[]}
                    availabilityTimeBlocks={availabilityTimeBlocks}
                    groupAvailabilities={SAMPLE_MEMBERS}
                />
            ) : (
                <PersonalAvailability
                    columns={5}
                    meetingData={meetingData}
                    meetingDates={meetingDates}
                    availability={userAvailability}
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
