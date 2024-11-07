import React from "react";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";

interface CalendarBodyDaySquareProps {
    isHighlighted: boolean;
    calendarDay: ZotDate;
    isCurrentMonth: boolean;
}

export function CalendarBodyDaySquare({
    isHighlighted,
    calendarDay,
    isCurrentMonth,
}: CalendarBodyDaySquareProps) {
    const isSelected = calendarDay.isSelected;

    return (
        <p
            className={cn(
                "flex-center text-gray-dark relative aspect-square h-8 w-8 rounded-lg text-base font-medium md:h-12 md:w-12 md:rounded-xl md:text-xl",
                isSelected && "bg-blue-500 text-gray-50",
                isHighlighted && "text-gray-dark bg-slate-300",
                !isCurrentMonth &&
                    cn(
                        "text-gray-300",
                        isHighlighted && "bg-opacity-30",
                        isSelected && "bg-opacity-50 text-gray-100"
                    )
            )}
            data-day={calendarDay.getDay()}
            data-month={calendarDay.getMonth()}
            data-year={calendarDay.getYear()}
            data-selected={isSelected}
        >
            {calendarDay.getDay()}
        </p>
    );
}
