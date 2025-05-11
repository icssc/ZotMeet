import { memo } from "react";
import { ZotDate } from "@/lib/zotdate";

interface AvailabilityTimeTicksProps {
    timeBlock: number;
}

export const AvailabilityTimeTicks = memo(
    ({ timeBlock }: AvailabilityTimeTicksProps) => {
        const isTopOfHour = timeBlock % 60 === 0;

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
);

AvailabilityTimeTicks.displayName = "AvailabilityTimeTicks";
