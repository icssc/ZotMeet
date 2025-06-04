import React, { Dispatch, SetStateAction, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { HourMinuteString } from "@/lib/types/chrono";
import { ClockIcon } from "lucide-react";

const convertTo24Hour = (hour: number, period: string) => {
    if (period === "PM" && hour !== 12) {
        hour += 12;
    } else if (period === "AM" && hour === 12) {
        hour = 0;
    }
    return hour.toString().padStart(2, "0");
};

const parseHourMinuteString = (
    time: HourMinuteString
): {
    hour: number;
    period: "AM" | "PM";
} => {
    const hour = parseInt(time.split(":")[0]);
    let displayHour = hour;
    const period = hour >= 12 ? "PM" : "AM";

    if (hour > 12) {
        displayHour = hour - 12;
    } else if (hour === 0) {
        displayHour = 12;
    }

    return { hour: displayHour, period };
};

interface MeetingTimeFieldProps {
    startTime: HourMinuteString;
    endTime: HourMinuteString;
    setStartTime: Dispatch<SetStateAction<HourMinuteString>>;
    setEndTime: Dispatch<SetStateAction<HourMinuteString>>;
}

export const MeetingTimeField = ({
    startTime,
    endTime,
    setStartTime,
    setEndTime,
}: MeetingTimeFieldProps) => {
    const { hour: initialStartHour, period: initialStartPeriod } =
        parseHourMinuteString(startTime);
    const { hour: initialEndHour, period: initialEndPeriod } =
        parseHourMinuteString(endTime);

    const [startHour, setStartHour] = useState(initialStartHour);
    const [startPeriod, setStartPeriod] = useState<"AM" | "PM">(
        initialStartPeriod
    );
    const [endHour, setEndHour] = useState(initialEndHour);
    const [endPeriod, setEndPeriod] = useState<"AM" | "PM">(initialEndPeriod);

    const handleStartHourChange = (value: string) => {
        const hour = parseInt(value);
        setStartHour(hour);
        setStartTime(
            `${convertTo24Hour(hour, startPeriod)}:00:00` as HourMinuteString
        );
    };

    const handleStartPeriodChange = (value: string) => {
        setStartPeriod(value as "AM" | "PM");
        setStartTime(
            `${convertTo24Hour(startHour, value)}:00:00` as HourMinuteString
        );
    };

    const handleEndHourChange = (value: string) => {
        const hour = parseInt(value);
        setEndHour(hour);
        setEndTime(
            `${convertTo24Hour(hour, endPeriod)}:00:00` as HourMinuteString
        );
    };

    const handleEndPeriodChange = (value: string) => {
        setEndPeriod(value as "AM" | "PM");
        setEndTime(
            `${convertTo24Hour(endHour, value)}:00:00` as HourMinuteString
        );
    };

    return (
        <div>
            <div className="flex flex-row items-center space-x-2 text-slate-medium">
                <ClockIcon />
                <p className="text-sm font-semibold uppercase tracking-wide">
                    ANY TIME BETWEEN (PST)
                </p>
            </div>

            <div className="flex w-full flex-row items-center space-x-4 pt-2 text-sm text-gray-500">
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
