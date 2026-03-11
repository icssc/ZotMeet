import type { Dispatch, SetStateAction } from "react";
import { ANCHOR_DATES, WEEKDAYS } from "@/lib/types/chrono";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";

interface WeekProps {
	selectedDays: ZotDate[];
	setSelectedDays: Dispatch<SetStateAction<ZotDate[]>>;
}

export function Week({ selectedDays, setSelectedDays }: WeekProps) {
	const handleDayClick = (dayIndex: number) => {
		const anchorDate = ANCHOR_DATES[dayIndex];
		const anchorZotDate = new ZotDate(anchorDate);
		const isSelected = selectedDays.some(
			(selectedDay) => selectedDay.day.getDay() === anchorDate.getDay(),
		);

		if (isSelected) {
			setSelectedDays(
				selectedDays.filter(
					(selectedDay) => selectedDay.day.getDay() !== anchorDate.getDay(),
				),
			);
		} else {
			setSelectedDays([...selectedDays, anchorZotDate]);
		}
	};

	return (
		<div className="flex flex-wrap justify-center gap-4">
			{WEEKDAYS.map((dayOfWeek, index) => {
				const anchorDate = ANCHOR_DATES[index];
				const isSelected = selectedDays.some(
					(selectedDay) => selectedDay.day.getDay() === anchorDate.getDay(),
				);

				return (
					<button
						key={dayOfWeek}
						type="button"
						className={cn(
							"flex h-12 w-20 items-center justify-center rounded-lg border font-medium text-base transition-colors duration-150",
							isSelected
								? "border-primary bg-primary text-white shadow-sm"
								: "border-gray-200 bg-white text-gray-700 hover:border-primary/40 hover:bg-primary/5",
						)}
						onClick={() => handleDayClick(index)}
					>
						{dayOfWeek}
					</button>
				);
			})}
		</div>
	);
}
