import { Dispatch, SetStateAction } from "react";
import { CalendarBodyDayCell } from "@/components/creation/calendar/calendar-body-day-cell";
import { ZotDate } from "@/lib/zotdate";
import { isDatePast } from "@/lib/creation/utils";

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
    const dayIsPast = isDatePast(calendarDay.day);

    /* Confirms the current highlight selection and updates calendar accordingly */
    const handleEndSelection = () => {
        if (startDaySelection) {
            if (isDatePast(calendarDay.day) && calendarDay.compareTo(startDaySelection) !== 0) {
                setStartDaySelection(undefined);
                setEndDaySelection(undefined);
                return;
            }
            try {
                setEndDaySelection(calendarDay);
                updateSelectedRange(startDaySelection, calendarDay);
            } catch (err) {
                console.error(err);
            }
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

        const touchingDayAttr = touchingElement.getAttribute("data-day");
        const touchingMonthAttr = touchingElement.getAttribute("data-month");
        const touchingYearAttr = touchingElement.getAttribute("data-year");


        if (startDaySelection && touchingDayAttr && touchingMonthAttr && touchingYearAttr) {
            const day = ZotDate.extractDayFromElement(touchingElement);
            if (day && !isDatePast(day.day)) {
                setEndDaySelection(day ?? undefined);
            }
        }
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
        if (dayIsPast && !calendarDay.isSelected) {
            if (e.cancelable) e.preventDefault();
            return;
        }
        if (e.cancelable) {
            e.preventDefault();
        }
        setStartDaySelection(calendarDay);
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
        if (dayIsPast && !calendarDay.isSelected && (!startDaySelection || startDaySelection.compareTo(calendarDay) !==0) ) {
             if (e.cancelable) e.preventDefault();
            setStartDaySelection(undefined);
            setEndDaySelection(undefined);
            return;
        }
        if (e.cancelable) {
            e.preventDefault();
        }

        handleEndSelection();
    };

    const handleMouseMove = () => {
        if (startDaySelection) {
            if (isDatePast(calendarDay.day) && calendarDay.compareTo(startDaySelection) !==0 ) {
                return;
            }
            setEndDaySelection(calendarDay);
        }
    };

    const handleMouseUp = () => {
        if (dayIsPast && !calendarDay.isSelected && (!startDaySelection || startDaySelection.compareTo(calendarDay) !==0)) {
            setStartDaySelection(undefined);
            setEndDaySelection(undefined);
            return;
        }
        if (startDaySelection) {
            handleEndSelection();
        }
    };

    const handleMouseDown = () => {
        if (dayIsPast && !calendarDay.isSelected) return;
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
                disabled={dayIsPast && !calendarDay.isSelected}
                className="relative flex w-full cursor-pointer select-none justify-center py-1"
            >
                <CalendarBodyDayCell
                    isHighlighted={!!isHighlighted}
                    calendarDay={calendarDay}
                    isCurrentMonth={isCurrentMonth}
                    isPast={dayIsPast}
                />
            </button>
        </td>
    );
}
