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

    /**
     * Updates the current highlight selection whenever a mobile user drags on the calendar
     * @param {TouchEvent} e - Touch event from a mobile user
     */
    const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
        const touchingElement = document.elementFromPoint(
            e.touches[0].clientX,
            e.touches[0].clientY
        );

        if (!touchingElement) return;

        const touchingDay = touchingElement.getAttribute("data-day");

        if (startDaySelection && touchingDay) {
            const day = ZotDate.extractDayFromElement(touchingElement);
            setEndDaySelection(day);
        }
    };

    /* Confirms the current highlight selection and updates calendar accordingly */
    const handleEndSelection = () => {
        if (startDaySelection && endDaySelection) {
            try {
                updateSelectedRange(startDaySelection, endDaySelection);
            } catch (err) {
                console.error(err);
            }
        }

        updateCalendar();

        setStartDaySelection(null);
        setEndDaySelection(null);
    };

    return (
        <tbody>
            {calendarDays.map((calendarWeek, weekIndex) => (
                <tr key={weekIndex}>
                    {calendarWeek.map((calendarDay, dayIndex) => {
                        const isHighlighted =
                            startDaySelection &&
                            endDaySelection &&
                            calendarDay.determineDayWithinBounds(
                                startDaySelection,
                                endDaySelection
                            );

                        const isCurrentMonth =
                            currentMonth === calendarDay.getMonth();

                        return (
                            <td
                                key={dayIndex}
                                onMouseUp={() => {
                                    if (startDaySelection) {
                                        setEndDaySelection(calendarDay);
                                        handleEndSelection();
                                    }
                                }}
                            >
                                <button
                                    onTouchStart={(e) => {
                                        if (e.cancelable) {
                                            e.preventDefault();
                                        }
                                        setStartDaySelection(calendarDay);
                                    }}
                                    onMouseDown={() => {
                                        setStartDaySelection(calendarDay);
                                    }}
                                    onTouchMove={handleTouchMove}
                                    onMouseMove={() => {
                                        if (startDaySelection) {
                                            setEndDaySelection(calendarDay);
                                        }
                                    }}
                                    onTouchEnd={(e) => {
                                        if (e.cancelable) {
                                            e.preventDefault();
                                        }
                                        if (!endDaySelection) {
                                            setEndDaySelection(calendarDay);
                                        }
                                        handleEndSelection();
                                    }}
                                    className="relative flex w-full cursor-pointer select-none justify-center py-2"
                                >
                                    <CalendarBodyDay
                                        isHighlighted={!!isHighlighted}
                                        calendarDay={calendarDay}
                                        isCurrentMonth={isCurrentMonth}
                                    />
                                </button>
                            </td>
                        );
                    })}
                </tr>
            ))}
        </tbody>
    );
}
