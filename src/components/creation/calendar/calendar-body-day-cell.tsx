import { Typography } from "@mui/material";
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
	const today = new Date();
	const isToday =
		calendarDay.getDay() === today.getDate() &&
		calendarDay.getMonth() === today.getMonth() &&
		calendarDay.getYear() === today.getFullYear();

	const dayClassName = cn(
		"relative aspect-square h-10 w-10 flex-center rounded-xl text-2xl",
		isSelected && "bg-primary text-gray-50",
		isHighlighted && "bg-slate-base text-gray-dark",
		isToday && !isSelected && "ring-2 ring-primary",
	);

	return (
		<div>
			{isCurrentMonth ? (
				<Typography color="textPrimary" className={dayClassName} variant="h6">
					{calendarDay.getDay()}
				</Typography>
			) : (
				<Typography color="textDisabled" className={dayClassName} variant="h6">
					{calendarDay.getDay()}
				</Typography>
			)}
		</div>
	);
}
