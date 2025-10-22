import { ZotDate } from "@/lib/zotdate";

interface AvailabilityTableHeaderProps {
    currentPageAvailability: (ZotDate | null)[];
    spacerBeforeDate: boolean[];
}

export function AvailabilityTableHeader({
    currentPageAvailability,
    spacerBeforeDate,
}: AvailabilityTableHeaderProps) {
    return (
        <thead>
            <tr>
                <th className="w-10 md:w-16">
                    <span className="sr-only">Time</span>
                </th>
                {currentPageAvailability?.map((dateHeader, index) => {
                    const cells: React.ReactNode[] = []; // Insert a spacer column before non-consecutive dates
                    if (spacerBeforeDate?.[index]) {
                        cells.push(
                            <th
                                key={`spacer-th-${index}`}
                                className="w-2 bg-transparent p-0"
                            ></th>
                        );
                    }

                    cells.push(
                        <th
                            key={`date-th-${index}`}
                            className="text-sm font-normal"
                        >
                            {dateHeader && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase text-gray-500 md:text-xs">
                                        {dateHeader.day.toLocaleDateString(
                                            "en-US",

                                            {
                                                weekday: "short",
                                            }
                                        )}
                                    </span>
                                    <span className="text-center text-[12px] uppercase text-gray-medium md:text-base">
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
                    );

                    return cells;
                })}
            </tr>
        </thead>
    );
}
