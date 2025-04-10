"use client";

import {
    getTimeFromHourMinuteString,
    SAMPLE_MEMBERS,
} from "@/lib/availability/utils";
import { HourMinuteString } from "@/lib/types/chrono";
import useAvailabilityStore from "@/store/useAvailabilityStore";

import { GroupAvailability } from "./group-availability";
import { PersonalAvailability } from "./personal-availability";

export default function AvailabilityBody({
    meetingData,
    meetingDates,
    userAvailability,
}: {
    meetingData: any;
    meetingDates: any;
    userAvailability: any;
}) {
    const { value } = useAvailabilityStore();
    const availabilityTimeBlocks = generateTimeBlocks(
        getTimeFromHourMinuteString(meetingData.fromTime as HourMinuteString),
        getTimeFromHourMinuteString(meetingData.toTime as HourMinuteString)
    );

    return (
        <div className={"space-y-6 px-6"}>
            {value === "group" ? (
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
