import { Dispatch, SetStateAction } from "react";
import { CalendarBodyDayCell } from "@/components/creation/calendar/calendar-body-day-cell";
import { ZotDate } from "@/lib/zotdate";

interface CalendarBodyDayProps {
    calendarDay: ZotDate;
    startDaySelection: ZotDate | undefined;
    setStartDaySelection: Dispatch<SetStateAction<ZotDate | undefined>>;
    endDaySelection: ZotDate | undefined;
    setEndDaySelection: Dispatch<SetStateAction<ZotDate | undefined>>;
    currentMonth: number;
    updateSelectedRange: (startDate: ZotDate, endDate: ZotDate) => void;
}

export function CalendarBodyDay({
    calendarDay,
    startDaySelection,
    setStartDaySelection,
    endDaySelection,
    setEndDaySelection,
    currentMonth,
    updateSelectedRange,
}: CalendarBodyDayProps) {
    const isHighlighted =
        startDaySelection &&
        endDaySelection &&
        calendarDay.determineDayWithinBounds(
            startDaySelection,
            endDaySelection
        );

    const isCurrentMonth = currentMonth === calendarDay.getMonth();

    /* Confirms the current highlight selection and updates calendar accordingly */
    const handleEndSelection = () => {
        try {
            if (startDaySelection && endDaySelection) {
                updateSelectedRange(startDaySelection, endDaySelection);
            } else if (startDaySelection) {
                updateSelectedRange(startDaySelection, calendarDay);
            }
        } catch (err) {
            console.error(err);
        }
        setStartDaySelection(undefined);
        setEndDaySelection(undefined);
    };

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
            setEndDaySelection(day ?? undefined);
        }
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        setStartDaySelection(calendarDay);
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
        if (e.cancelable) {
            e.preventDefault();
        }

        handleEndSelection();
    };

    const handleMouseMove = () => {
        if (startDaySelection) {
            setEndDaySelection(calendarDay);
        }
    };

    const handleMouseUp = () => {
        if (startDaySelection) {
            handleEndSelection();
        }
    };

    const handleMouseDown = () => {
        setStartDaySelection(calendarDay);
    };

    return (
        <td onMouseUp={handleMouseUp}>
            <button
                onTouchMove={handleTouchMove}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                className="relative flex w-full cursor-pointer select-none justify-center py-2"
                style={{
                    touchAction: "pinch-zoom",
                }}
            >
                <CalendarBodyDayCell
                    isHighlighted={!!isHighlighted}
                    calendarDay={calendarDay}
                    isCurrentMonth={isCurrentMonth}
                />
            </button>
        </td>
    );
}
