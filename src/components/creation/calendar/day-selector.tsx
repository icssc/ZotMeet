import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { ANCHOR_DATES, WEEKDAYS, getAnchorDateIndex } from "@/lib/types/chrono";
import { cn } from "@/lib/utils";

interface DaySelectorProps {
    selectedDays: string[];
    setSelectedDays: Dispatch<SetStateAction<string[]>>;
}

export function DaySelector({
    selectedDays,
    setSelectedDays,
}: DaySelectorProps) {
    const handleDayClick = (dayIndex: number) => {
        const anchorDate = ANCHOR_DATES[dayIndex];
        const anchorDateString = anchorDate.toISOString().split('T')[0];
        const isSelected = selectedDays.includes(anchorDateString);

        if (isSelected) {
            setSelectedDays(selectedDays.filter((date) => date !== anchorDateString));
        } else {
            setSelectedDays([...selectedDays, anchorDateString]);
        }
    };

    return (
        <tbody>
            <tr>
                <td
                    colSpan={7}
                    className="text-center"
                >
                    <div className="grid grid-cols-7 gap-2 p-3">
                        {WEEKDAYS.map((dayOfWeek, index) => {
                            const anchorDate = ANCHOR_DATES[index];
                            const anchorDateString = anchorDate.toISOString().split('T')[0];
                            const isSelected = selectedDays.includes(anchorDateString);

                            return (
                                <Button
                                    key={dayOfWeek}
                                    variant="outline"
                                    className={cn(
                                        "flex h-16 flex-col items-center justify-center rounded-md border border-gray-300 p-2 transition-colors duration-200",
                                        isSelected
                                            ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                                            : "hover:bg-gray-100"
                                    )}
                                    onClick={() => handleDayClick(index)}
                                >
                                    <p className="text-xl">{dayOfWeek}</p>
                                </Button>
                            );
                        })}
                    </div>
                </td>
            </tr>
        </tbody>
    );
}
