"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createMeeting } from "@/actions/creation/createMeeting";
import { Calendar } from "@/components/creation/calendar/calendar";
import { MeetingNameField } from "@/components/creation/fields/meeting-name-field";
import { MeetingTimeField } from "@/components/creation/fields/meeting-time-field";
import { Button } from "@/components/ui/button";
import { HourMinuteString } from "@/lib/types/chrono";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";

export function Creation() {
    const [selectedDays, setSelectedDays] = useState<ZotDate[]>([]);
    const [startTime, setStartTime] = useState<HourMinuteString>("9:00");
    const [endTime, setEndTime] = useState<HourMinuteString>("13:00");
    const [meetingName, setMeetingName] = useState("");
    const router = useRouter();

    const handleCreation = async () => {
        const newMeeting = {
            title: meetingName,
            fromTime: startTime,
            toTime: endTime,
            meetingDates: selectedDays.map((zotDate) =>
                zotDate.day.toISOString()
            ),
            description: "",
        };

        const meeting = await createMeeting(newMeeting);
        const { meetingId, error } = meeting;

        if (error) {
            console.error("Failed to create meeting: ", error);
        }

        if (!meetingId) {
            console.error("Failed to create meeting. Meeting ID not found.");
            return;
        }

        router.push(`/availability/${meetingId}`);
    };

    const hasValidInputs = () => {
        return (
            selectedDays.length > 0 &&
            startTime &&
            endTime &&
            startTime < endTime &&
            meetingName
        );
    };

    return (
        <div className="space-y-6 px-4 pb-6">
            <div className="px-4 pt-8 md:pl-[60px] md:pt-10">
                <h2 className="font-montserrat text-gray-dark text-xl font-medium md:text-2xl">
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

            <div className="sticky bottom-0 -ml-2 flex w-[100vw] flex-row items-center justify-end gap-x-4 border-t-[1px] bg-white p-3 md:relative md:w-full md:border-t-0 md:bg-transparent md:py-0">
                <p className="text-slate-medium text-sm font-bold uppercase">
                    {selectedDays.length} days selected
                </p>

                <Button
                    className={cn(
                        "font-montserrat text-gray-light sm:btn-wide w-48 rounded-lg border-none bg-green-500 text-xl font-medium hover:bg-green-500/80"
                    )}
                    disabled={!hasValidInputs()}
                    onClick={handleCreation}
                >
                    Continue →
                </Button>
            </div>
        </div>
    );
}
