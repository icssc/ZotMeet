"use client";

import { useMemo, useState } from "react";
import { Calendar } from "@/components/creation/calendar/calendar";
import { MeetingNameField } from "@/components/creation/fields/meeting-name-field";
import { MeetingTimeField } from "@/components/creation/fields/meeting-time-field";
import { Button } from "@/components/ui/button";
import { SelectMeeting } from "@/db/schema";
import type { UserProfile } from "@/lib/auth/user";
import { convertTimeToUTC } from "@/lib/availability/utils";
import { HourMinuteString } from "@/lib/types/chrono";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import { createMeeting } from "@actions/meeting/create/action";

export function Creation({ user }: { user: UserProfile | null }) {
    const [selectedDays, setSelectedDays] = useState<ZotDate[]>([]);
    const [startTime, setStartTime] = useState<HourMinuteString>("09:00:00");
    const [endTime, setEndTime] = useState<HourMinuteString>("17:00:00");
    const [meetingName, setMeetingName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [meetingType, setMeetingType] =
        useState<SelectMeeting["meetingType"]>("dates");

    const handleCreation = async () => {
        if (isCreating) return;
        setIsCreating(true);

        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const dates = selectedDays.map((zotDate) => zotDate.day.toISOString());

        // Convert times from user's local timezone to UTC
        const referenceDate = dates[0];
        const fromTimeUTC = convertTimeToUTC(
            startTime,
            userTimezone,
            referenceDate
        );
        const toTimeUTC = convertTimeToUTC(
            endTime,
            userTimezone,
            referenceDate
        );

        const newMeeting = {
            title: meetingName,
            fromTime: fromTimeUTC,
            toTime: toTimeUTC,
            hostId: user?.memberId ?? "",
            timezone: userTimezone,
            dates,
            description: "",
            meetingType,
        };

        const result = await createMeeting(newMeeting);

        if (result?.error) {
            console.error("Failed to create meeting: ", result.error);
            setIsCreating(false);
        }
    };

    const hasValidInputs = useMemo(() => {
        return (
            selectedDays.length > 0 &&
            startTime &&
            endTime &&
            startTime < endTime &&
            meetingName
        );
    }, [selectedDays.length, startTime, endTime, meetingName]);

    return (
        <div className="space-y-6 px-4 pb-6">
            <div className="px-4 pt-8 md:pl-[60px] md:pt-8">
                <h2 className="font-montserrat text-xl font-medium text-gray-dark md:text-2xl">
                    Let&apos;s plan your next meeting.
                </h2>

                <h3 className="text-sm font-light text-gray-400 md:text-base">
                    Select potential dates and times for you and your team.
                </h3>
            </div>

            <div className="w-full rounded-xl border bg-white px-8 py-6 md:px-14">
                <div className="flex flex-col gap-6">
                    <MeetingNameField
                        meetingName={meetingName}
                        setMeetingName={setMeetingName}
                    />

                    <MeetingTimeField
                        startTime={startTime}
                        endTime={endTime}
                        setStartTime={setStartTime}
                        setEndTime={setEndTime}
                    />
                </div>
            </div>

            <Calendar
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
                meetingType={meetingType}
                setMeetingType={setMeetingType}
            />

            <div className="sticky bottom-0 -ml-2 flex w-[100vw] flex-row items-center justify-end gap-x-4 border-t-[1px] bg-white p-3 md:relative md:w-full md:border-t-0 md:bg-transparent md:py-0">
                <p className="text-sm font-bold uppercase text-slate-medium">
                    {selectedDays.length} days selected
                </p>

                <Button
                    className={cn(
                        "sm:btn-wide w-48 rounded-lg border-none bg-green-500 font-montserrat text-xl font-medium text-gray-light hover:bg-green-500/80"
                    )}
                    disabled={!hasValidInputs || isCreating}
                    onClick={handleCreation}
                >
                    {isCreating ? "Creating..." : "Continue →"}
                </Button>
            </div>
        </div>
    );
}
