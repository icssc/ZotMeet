import { useState } from "react";
import { CalendarBodyDay } from "@/components/creation/calendar/calendar-body-day";
import type { ZotDate } from "@/lib/zotdate";

interface CalendarBodyProps {
	calendarDays: ZotDate[][];
	currentMonth: number;
	updateSelectedRange: (startDate: ZotDate, endDate: ZotDate) => void;
	/** Lets horizontal scroll-snap parents receive touch pans (mobile month swipe). */
	allowScrollParentGesture?: boolean;
}

export function CalendarBody({
	calendarDays,
	currentMonth,
	updateSelectedRange,
	allowScrollParentGesture = false,
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
							allowScrollParentGesture={allowScrollParentGesture}
						/>
					))}
				</tr>
			))}
		</tbody>
	);
}
