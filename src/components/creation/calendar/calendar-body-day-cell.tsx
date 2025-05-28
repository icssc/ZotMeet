import React from "react";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";

interface CalendarBodyDayCellProps {
    isHighlighted: boolean;
    calendarDay: ZotDate;
    isCurrentMonth: boolean;
    isPast: boolean;
}

export function CalendarBodyDayCell({
    isHighlighted,
    calendarDay,
    isCurrentMonth,
    isPast,
}: CalendarBodyDayCellProps) {
    const isSelected = calendarDay.isSelected;

    return (
        <p
            className={cn(
                "flex-center relative aspect-square h-8 w-8 rounded-lg text-base font-medium text-gray-dark md:h-10 md:w-10 md:rounded-xl md:text-xl",
                isSelected && "bg-primary text-gray-50",
                isHighlighted && "bg-slate-base text-gray-dark",
                !isCurrentMonth &&
                    cn(
                        !isSelected && "text-gray-medium",
                        isHighlighted && !isSelected && "bg-opacity-30"
                    ),
                isPast && "pointer-events-none cursor-default text-gray-base opacity-50"
            )}
            data-day={calendarDay.getDay()}
            data-month={calendarDay.getMonth()}
            data-year={calendarDay.getYear()}
            data-selected={isSelected}
            data-past={isPast}
        >
            {calendarDay.getDay()}
        </p>
    );
}
