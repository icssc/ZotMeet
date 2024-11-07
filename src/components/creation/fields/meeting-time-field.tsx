import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { HourMinuteString } from "@/lib/types/chrono";
import { ClockIcon } from "lucide-react";

interface MeetingTimeFieldProps {
    setStartTime: Dispatch<SetStateAction<HourMinuteString>>;
    setEndTime: Dispatch<SetStateAction<HourMinuteString>>;
}

export const MeetingTimeField = ({
    setStartTime,
    setEndTime,
}: MeetingTimeFieldProps) => {
    const [startHour, setStartHour] = useState(9);
    const [endHour, setEndHour] = useState(4);
    const [startPeriod, setStartPeriod] = useState("AM");
    const [endPeriod, setEndPeriod] = useState("PM");

    const convertTo24Hour = (hour: number, period: string) => {
        if (period === "PM" && hour !== 12) {
            hour += 12;
        } else if (period === "AM" && hour === 12) {
            hour = 0;
        }
        return hour.toString().padStart(2, "0");
    };

    const handleStartHourChange = (value: string) => {
        setStartHour(parseInt(value));
    };

    const handleStartPeriodChange = (value: string) => {
        setStartPeriod(value);
    };

    const handleEndHourChange = (value: string) => {
        setEndHour(parseInt(value));
    };

    const handleEndPeriodChange = (value: string) => {
        setEndPeriod(value);
    };

    useEffect(() => {
        const newStartTime =
            `${convertTo24Hour(startHour, startPeriod)}:00` as HourMinuteString;
        const newEndTime =
            `${convertTo24Hour(endHour, endPeriod)}:00` as HourMinuteString;

        setStartTime(newStartTime);
        setEndTime(newEndTime);
    }, [startHour, startPeriod, endHour, endPeriod, setStartTime, setEndTime]);

    return (
        <div>
            <div className="text-slate-medium flex flex-row items-center space-x-2">
                <ClockIcon />
                <p className="text-sm font-semibold uppercase tracking-wide">
                    ANY TIME BETWEEN (PST)
                </p>
            </div>

            <div className="xs:flex-row xs:items-center xs:space-y-0 xs:pt-0 flex w-full flex-row items-center space-x-4 pt-2 text-sm text-gray-500">
                <div className="flex gap-2">
                    <Select
                        value={String(startHour)}
                        onValueChange={handleStartHourChange}
                    >
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder={startHour} />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from(
                                { length: 12 },
                                (_, i) => `${i + 1}`
                            ).map((hour) => (
                                <SelectItem
                                    key={hour}
                                    value={hour}
                                >
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={startPeriod}
                        onValueChange={handleStartPeriodChange}
                    >
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder={"AM"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <span> and </span>

                <div className="flex gap-2">
                    <Select
                        value={String(endHour)}
                        onValueChange={handleEndHourChange}
                    >
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder={endHour} />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from(
                                { length: 12 },
                                (_, i) => `${i + 1}`
                            ).map((hour) => (
                                <SelectItem
                                    key={hour}
                                    value={hour}
                                >
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={endPeriod}
                        onValueChange={handleEndPeriodChange}
                    >
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder={"PM"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};
