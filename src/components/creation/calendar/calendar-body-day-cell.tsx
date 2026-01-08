import { cn } from "@/lib/utils";
import type { ZotDate } from "@/lib/zotdate";

interface CalendarBodyDayCellProps {
	isHighlighted: boolean;
	calendarDay: ZotDate;
	isCurrentMonth: boolean;
}

export function CalendarBodyDayCell({
	isHighlighted,
	calendarDay,
	isCurrentMonth,
}: CalendarBodyDayCellProps) {
	const isSelected = calendarDay.isSelected;

	return (
		<p
			className={cn(
				"relative aspect-square h-8 w-8 flex-center rounded-lg font-medium text-base text-gray-dark md:h-12 md:w-12 md:rounded-xl md:text-xl",
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
