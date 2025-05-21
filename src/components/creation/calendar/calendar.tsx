import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { CalendarBody } from "@/components/creation/calendar/calendar-body";
import { DaySelector } from "@/components/creation/calendar/day-selector";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MONTHS, WEEKDAYS } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";

type CalendarMode = "dates" | "days";

interface CalendarProps {
    selectedDays: ZotDate[];
    setSelectedDays: Dispatch<SetStateAction<ZotDate[]>>
    mode: CalendarMode;
    setMode: Dispatch<SetStateAction<CalendarMode>>;
    selectedWeekdays: boolean[];
    setSelectedWeekdays: Dispatch<SetStateAction<boolean[]>>;
}


export function Calendar({selectedDays, setSelectedDays, mode, setMode, selectedWeekdays, setSelectedWeekdays}: CalendarProps) {

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const monthName = MONTHS[currentMonth];
    const calendarDays = useMemo(
        () => ZotDate.generateZotDates(currentMonth, currentYear, selectedDays),
        [currentMonth, currentYear, selectedDays]
    );

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

                // Remove any selected days if the multiselect initiated from an already selected day
                if (startDate.isSelected && foundSelectedDay) {
                    modifiedSelectedDays = modifiedSelectedDays.filter(
                        (d) => d.compareTo(foundSelectedDay) !== 0
                    );
                }

                // Add day to selected days if the multiselect did not initiate from an already selected day
                if (!startDate.isSelected && !foundSelectedDay) {
                    modifiedSelectedDays.push(
                        new ZotDate(
                            highlightedZotDate,
                            undefined,
                            undefined,
                            true
                        )
                    );
                }
            });

            return modifiedSelectedDays;
        });
    };

    return (
        <div className="flex items-center justify-between rounded-xl border bg-gradient-to-l from-[#00A96E0D] to-[#377CFB0D] py-7 md:p-5">
            {mode === "dates" && (
                <Button
                    onClick={decrementMonth}
                    className="bg-transparent p-3 hover:bg-transparent md:pl-1"
                >
                    <span className="text-3xl text-gray-500">&lsaquo;</span>
                </Button>
            )}

            <div className="md:px-4">
                <div className="flex items-center justify-between pb-5 md:pb-6">
                    <div className="flex flex-col">
                        {mode === "dates" ? (
                            <h3 className="text-left font-montserrat text-2xl font-semibold text-gray-dark md:text-3xl">
                                {monthName} {currentYear}
                            </h3>
                        ) : (
                            <h3 className="text-left font-montserrat text-2xl font-semibold text-gray-dark md:text-3xl">
                                Select Days
                            </h3>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className={`font-light ${mode === "dates" ? "bg-gray-200" : ""}`}
                            onClick={() => setMode("dates")}
                        >
                            Specific dates
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className={`font-light ${mode === "days" ? "bg-gray-200" : ""}`}
                            onClick={() => setMode("days")}
                        >
                            Days of the week
                        </Button>
                    </div>
                </div>

                <table className="w-full table-fixed p-3">
                    {mode === "dates" && (
                        <thead>
                            <tr>
                                {WEEKDAYS.map((dayOfWeek) => (
                                    <th
                                        className="px-0"
                                        key={dayOfWeek}
                                    >
                                        <div>
                                            <p className="w-full text-center text-sm font-light uppercase text-slate-medium md:font-bold">
                                                {dayOfWeek}
                                            </p>
                                        </div>
                                        <Separator className="my-2 h-[2px] bg-slate-base" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    )}

                    {mode === "dates" && (
                        <CalendarBody
                            calendarDays={calendarDays}
                            currentMonth={currentMonth}
                            updateSelectedRange={updateSelectedRange}
                        />
                    )}
                    {mode === "days" && (
                        <DaySelector
                            selectedWeekdays={selectedWeekdays}
                            setSelectedWeekdays={setSelectedWeekdays}
                        />
                    )}
                </table>
            </div>

            {mode === "dates" && (
                <Button
                    onClick={incrementMonth}
                    className="bg-transparent p-3 hover:bg-transparent md:pr-1"
                >
                    <span className="text-3xl text-gray-500">&rsaquo;</span>
                </Button>
            )}
        </div>
    );
}
