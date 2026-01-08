import React, { useState } from "react";
import { CalendarBodyDay } from "@/components/creation/calendar/calendar-body-day";
import { ZotDate } from "@/lib/zotdate";

interface CalendarBodyProps {
	calendarDays: ZotDate[][];
	currentMonth: number;
	updateSelectedRange: (startDate: ZotDate, endDate: ZotDate) => void;
}

export function CalendarBody({
	calendarDays,
	currentMonth,
	updateSelectedRange,
}: CalendarBodyProps) {
	const [startDaySelection, setStartDaySelection] = useState<ZotDate>();
	const [endDaySelection, setEndDaySelection] = useState<ZotDate>();

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
							currentMonth={currentMonth}
							updateSelectedRange={updateSelectedRange}
						/>
					))}
				</tr>
			))}
		</tbody>
	);
}
