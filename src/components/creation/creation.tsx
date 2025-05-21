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
import { WEEKDAYS } from "@/lib/types/chrono";

type CalendarMode = "dates" | "days";

const initialSelectedWeekdays = WEEKDAYS.map(() => false);

export function Creation() {
    const [selectedDays, setSelectedDays] = useState<ZotDate[]>([]);
    const [mode, setMode] = useState<CalendarMode>("dates");
    const [selectedWeekdays, setSelectedWeekdays] = useState<boolean[]>(initialSelectedWeekdays);
    const [startTime, setStartTime] = useState<HourMinuteString>("09:00:00");
    const [endTime, setEndTime] = useState<HourMinuteString>("13:00:00");
    const [meetingName, setMeetingName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleCreation = async () => {
        if (isCreating) return;
        setIsCreating(true);

        const newMeetingBase = {
            title: meetingName,
            fromTime: startTime,
            toTime: endTime,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            description: "",
        };

        let newMeetingPayload;

        if (mode === 'dates') {
            newMeetingPayload = {
                ...newMeetingBase,
                meetingDates: selectedDays.map((zotDate) =>
                    zotDate.day.toISOString()
                ),
                meetingType: 'dates' as const,
                selectedWeekdays: [],
            };
        } else {
            newMeetingPayload = {
                ...newMeetingBase,
                selectedWeekdays: selectedWeekdays,
                meetingType: 'days' as const,
                meetingDates: [],
            };
        }

        const result = await createMeeting(newMeetingPayload);

        if (result?.error) {
            console.error("Failed to create meeting: ", result.error);
            setIsCreating(false);
        }
    };

    const hasValidInputs = useMemo(() => {
        const timeIsValid = startTime && endTime && startTime < endTime;
        const nameIsValid = meetingName.length > 0;
        const datesSelected = mode === 'dates' && selectedDays.length > 0;
        const daysSelected = mode === 'days' && selectedWeekdays.some(day => day === true);

        return (timeIsValid && nameIsValid && (datesSelected || daysSelected));
    }, [selectedDays.length, selectedWeekdays, startTime, endTime, meetingName, mode]);

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
                mode={mode}
                setMode={setMode}
                selectedWeekdays={selectedWeekdays}
                setSelectedWeekdays={setSelectedWeekdays}
            />

            <div className="sticky bottom-0 -ml-2 flex w-[100vw] flex-row items-center justify-end gap-x-4 border-t-[1px] bg-white p-3 md:relative md:w-full md:border-t-0 md:bg-transparent md:py-0">
                <p className="text-sm font-bold uppercase text-slate-medium">
                    {mode === 'dates' ? `${selectedDays.length} days selected` : `${selectedWeekdays.filter(day => day).length} days of week selected`}
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
