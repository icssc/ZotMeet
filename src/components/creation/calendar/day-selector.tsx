import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { WEEKDAYS } from "@/lib/types/chrono";

interface DaySelectorProps {
    selectedWeekdays: boolean[];
    setSelectedWeekdays: Dispatch<SetStateAction<boolean[]>>;
}

export function DaySelector({ selectedWeekdays, setSelectedWeekdays }: DaySelectorProps) {

    const handleDayClick = (dayIndex: number) => {
        const newSelectedWeekdays = [...selectedWeekdays];
        newSelectedWeekdays[dayIndex] = !newSelectedWeekdays[dayIndex];
        setSelectedWeekdays(newSelectedWeekdays);
        console.log(newSelectedWeekdays);
    };

    return (
        <tbody>
            <tr>
                <td colSpan={7} className="text-center">
                    <div className="grid grid-cols-7 gap-2 p-3">
                        {WEEKDAYS.map((dayOfWeek, index) => (
                            <Button
                                key={dayOfWeek}
                                variant="outline"
                                className={`flex flex-col items-center justify-center h-16 p-2 rounded-md border border-gray-300 transition-colors duration-200
                                    ${selectedWeekdays[index] ? 'bg-primary text-white hover:bg-primary/90 hover:text-white' : 'hover:bg-gray-100'}`
                                }
                                onClick={() => handleDayClick(index)}
                            >
                                <p className="text-xl">{dayOfWeek}</p> 
                            </Button>
                        ))}
                    </div>
                </td>
            </tr>
        </tbody>
    );
}
