import { cn } from "@/lib/utils";
import type { ZotDate } from "@/lib/zotdate";

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
				"relative h-6 w-6 flex-center rounded-lg font-medium text-base text-gray-dark md:h-8 md:w-8 md:rounded-xl md:text-lg",
				isSelected && "bg-primary text-gray-50",
				isHighlighted && "bg-slate-base text-gray-dark",
				!isCurrentMonth &&
					cn(
						"text-gray-base",
						isHighlighted && "bg-opacity-30",
						isSelected && "bg-opacity-50 text-gray-100",
					),
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
