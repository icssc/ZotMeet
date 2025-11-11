import React from "react";
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
                {currentPageAvailability?.map((dateHeader, index) => (
                    <React.Fragment key={index}>
                        {spacerBeforeDate[index] && (
                            <td className="medium w-2 bg-transparent p-0" />
                        )}
                        <th>
                            {dateHeader && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase text-gray-500 md:text-xs">
                                        {dateHeader.day.toLocaleDateString(
                                            "en-US",
                                            { weekday: "short" }
                                        )}
                                    </span>
                                    <span className="text-center text-[12px] uppercase text-gray-medium md:text-base">
                                        {dateHeader.day.toLocaleDateString(
                                            "en-US",
                                            { month: "numeric", day: "numeric" }
                                        )}
                                    </span>
                                </div>
                            )}
                        </th>
                    </React.Fragment>
                ))}
            </tr>
        </thead>
    );
}
