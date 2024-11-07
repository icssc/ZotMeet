import React, { useState } from "react";
import { CalendarBodyDay } from "@/components/creation/calendar/calendar-body-day";
import { ZotDate } from "@/lib/zotdate";

interface CalendarBodyProps {
    calendarDays: ZotDate[][];
    updateCalendar: VoidFunction;
    currentMonth: number;
    updateSelectedRange: (startDate: ZotDate, endDate: ZotDate) => void;
}

export function CalendarBody({
    calendarDays,
    updateCalendar,
    currentMonth,
    updateSelectedRange,
}: CalendarBodyProps) {
    const [startDaySelection, setStartDaySelection] = useState<ZotDate | null>(
        null
    );
    const [endDaySelection, setEndDaySelection] = useState<ZotDate | null>(
        null
    );

    return (
        <tbody>
            {calendarDays.map((calendarWeek, weekIndex) => (
                <tr key={weekIndex}>
                    {calendarWeek.map((calendarDay, dayIndex) => (
                        <CalendarBodyDay
                            key={dayIndex}
                            calendarDay={calendarDay}
                            startDaySelection={startDaySelection}
                            setStartDaySelection={setStartDaySelection}
                            endDaySelection={endDaySelection}
                            setEndDaySelection={setEndDaySelection}
                            updateCalendar={updateCalendar}
                            currentMonth={currentMonth}
                            updateSelectedRange={updateSelectedRange}
                        />
                    ))}
                </tr>
            ))}
        </tbody>
    );
}
