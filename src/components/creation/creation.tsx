"use client";

import { useMemo, useState } from "react";
import { Calendar } from "@/components/creation/calendar/calendar";
import { MeetingNameField } from "@/components/creation/fields/meeting-name-field";
import { MeetingTimeField } from "@/components/creation/fields/meeting-time-field";
import { Button } from "@/components/ui/button";
import { HourMinuteString } from "@/lib/types/chrono";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import { createMeeting } from "@actions/meeting/create/action";

export function Creation() {
    const [selectedDays, setSelectedDays] = useState<ZotDate[]>([]);
    const [startTime, setStartTime] = useState<HourMinuteString>("09:00:00");
    const [endTime, setEndTime] = useState<HourMinuteString>("13:00:00");
    const [meetingName, setMeetingName] = useState("");

    const handleCreation = async () => {
        const newMeeting = {
            title: meetingName,
            fromTime: startTime,
            toTime: endTime,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            meetingDates: selectedDays.map((zotDate) =>
                zotDate.day.toISOString()
            ),
            description: "",
        };

        const result = await createMeeting(newMeeting);
        const error = result?.error;

        if (error) {
            console.error("Failed to create meeting: ", error);
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
            <div className="px-4 pt-8 md:pl-[60px] md:pt-10">
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
                        setStartTime={setStartTime}
                        setEndTime={setEndTime}
                    />
                </div>
            </div>

            <Calendar
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
            />

            <div className="sticky bottom-0 -ml-2 flex w-[100vw] flex-row items-center justify-end gap-x-4 border-t-[1px] bg-white p-3 
                md:w-full md:border-2 md:rounded-xl md:bottom-4 md:ml-0 md:drop-shadow-sm">
                <p className="text-sm font-bold uppercase text-slate-medium">
                    {selectedDays.length} days selected
                </p>

                <Button
                    className={cn(
                        "sm:btn-wide w-48 rounded-lg border-none bg-green-500 font-montserrat text-xl font-medium text-gray-light hover:bg-green-500/80"
                    )}
                    disabled={!hasValidInputs}
                    onClick={handleCreation}
                >
                    Continue →
                </Button>
            </div>
        </div>
    );
}
