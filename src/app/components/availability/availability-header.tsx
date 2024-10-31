import { useAvailabilityContext } from "@/app/components/availability/availability-context";
import { ZotDate } from "@/lib/zotdate";

export function AvailabilityHeader() {
    const { currentPageAvailability } = useAvailabilityContext();

    return (
        <thead>
            <tr>
                <th className="w-10 md:w-16">
                    <span className="sr-only">Time</span>
                </th>
                {currentPageAvailability?.map((dateHeader, index) => (
                    <th
                        key={index}
                        className="text-sm font-normal"
                    >
                        {dateHeader && (
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase text-gray-500 md:text-xs">
                                    {dateHeader.day.toLocaleDateString(
                                        "en-US",
                                        { weekday: "short" }
                                    )}
                                </span>
                                <span className="text-gray-medium text-center text-[12px] uppercase md:text-base">
                                    {dateHeader.day.toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "numeric",
                                            day: "numeric",
                                        }
                                    )}
                                </span>
                            </div>
                        )}
                    </th>
                ))}
            </tr>
        </thead>
    );
}
