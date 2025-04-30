"use client";

import { ZotDate } from "@/lib/zotdate";

interface AvailabilityTimeTicksProps {
    timeBlock: number;
    isTopOfHour: boolean;
    isHalfHour: boolean;
}

export function AvailabilityTimeTicks({
    timeBlock,
    isTopOfHour,
    isHalfHour,
}: AvailabilityTimeTicksProps) {
    return (
        <td className="w-2 border-r-[1px] border-r-gray-medium py-0 pr-3 align-top">
            {isTopOfHour && (
                <>
                    <span className="float-right hidden whitespace-nowrap text-[10px] font-bold text-gray-medium md:flex md:text-xs">
                        {ZotDate.toTimeBlockString(timeBlock, false)}
                    </span>
                    <span className="float-right flex whitespace-nowrap text-[10px] font-bold text-gray-medium md:hidden md:text-xs">
                        {ZotDate.toTimeBlockString(timeBlock, true)}
                    </span>
                </>
            )}
        </td>
    );
}
