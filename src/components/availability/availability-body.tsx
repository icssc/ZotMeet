"use client";

import { AvailabilityWrapper } from "@/components/availability/availability-wrapper";
import { SelectMeeting } from "@/db/schema";
import { MemberMeetingAvailability } from "@/lib/types/availability";

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
    return (
        <AvailabilityWrapper
            meetingData={meetingData}
            meetingDates={meetingDates}
            userAvailability={userAvailability}
            allAvailabilties={allAvailabilties}
        />
    );
}
