import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from "react";
import { CalendarBody } from "@/components/creation/calendar/calendar-body";
import { MONTHS, WEEKDAYS } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";

interface CalendarProps {
    selectedDays: ZotDate[];
    setSelectedDays: Dispatch<SetStateAction<ZotDate[]>>;
}

export function Calendar({ selectedDays, setSelectedDays }: CalendarProps) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [calendarDays, setCalendarDays] = useState<ZotDate[][]>([]);

    const monthName = MONTHS[currentMonth];

    const updateCalendar = useCallback(() => {
        const days = ZotDate.generateZotDates(
            currentMonth,
            currentYear,
            selectedDays
        );

        setCalendarDays(days);
    }, [currentMonth, currentYear, selectedDays]);

    const decrementMonth = () => {
        let newMonth = currentMonth - 1;
        let newYear = currentYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const incrementMonth = () => {
        let newMonth = currentMonth + 1;
        let newYear = currentYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    /**
     * Updates a range of dates based on a user selection
     * @param startDate the day that the user first initiated the date multiselect range
     * @param endDate the day that the user ended the date multiselect range
     */
    const updateSelectedRange = (
        startDate: ZotDate,
        endDate: ZotDate
    ): void => {
        const highlightedRange: Date[] = ZotDate.generateRange(
            startDate.day,
            endDate.day
        );

        setSelectedDays((alreadySelectedDays: ZotDate[]) => {
            let modifiedSelectedDays = [...alreadySelectedDays];

            highlightedRange.forEach((highlightedZotDate: Date) => {
                const foundSelectedDay = alreadySelectedDays.find(
                    (d) => d.compareTo(new ZotDate(highlightedZotDate)) === 0
                );

                if (startDate.isSelected && foundSelectedDay) {
                    // Remove any selected days if the multiselect initiated from an already selected day
                    modifiedSelectedDays = modifiedSelectedDays.filter(
                        (d) => d.compareTo(foundSelectedDay) !== 0
                    );
                } else if (!startDate.isSelected && !foundSelectedDay) {
                    // Add day to selected days if the multiselect did not initiate from an already selected day
                    modifiedSelectedDays.push(
                        new ZotDate(highlightedZotDate, true)
                    );
                }
            });

            return modifiedSelectedDays;
        });
    };

    useEffect(() => {
        updateCalendar();
    }, [updateCalendar]);

    return (
        <div className="flex items-center justify-between rounded-xl border bg-gradient-to-l from-[#00A96E0D] to-[#377CFB0D] py-7 md:p-5">
            <button
                onClick={decrementMonth}
                className="p-3 md:pl-1"
            >
                <span className="text-3xl text-gray-500">&lsaquo;</span>
            </button>

            <div className="md:px-4">
                <div className="flex flex-col pb-5 md:pb-6">
                    <h3 className="font-montserrat text-gray-dark text-left text-2xl font-semibold md:text-3xl">
                        {monthName} {currentYear}
                    </h3>
                    <div className="divider m-0 h-[2px] w-12 bg-accent md:w-16" />
                </div>

                <table className="w-full table-fixed p-3">
                    <thead>
                        <tr>
                            {WEEKDAYS.map((dayOfWeek) => (
                                <th
                                    className="px-0"
                                    key={dayOfWeek}
                                >
                                    <div>
                                        <p className="text-slate-medium w-full text-center text-sm font-light uppercase md:font-bold">
                                            {dayOfWeek}
                                        </p>
                                    </div>
                                    <div className="divider mt-0" />
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <CalendarBody
                        calendarDays={calendarDays}
                        updateCalendar={updateCalendar}
                        currentMonth={currentMonth}
                        updateSelectedRange={updateSelectedRange}
                    />
                </table>
            </div>

            <button
                onClick={incrementMonth}
                className="p-3 md:pr-1"
            >
                <span className="text-3xl text-gray-500">&rsaquo;</span>
            </button>
        </div>
    );
}
