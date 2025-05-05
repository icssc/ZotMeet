import { ZotDate } from "@/lib/zotdate";

interface AvailabilityTimeTicksProps {
    timeBlock: number;
}

export function AvailabilityTimeTicks({
    timeBlock,
}: AvailabilityTimeTicksProps) {
    const isTopOfHour = timeBlock % 60 === 0;

    return (
        <td className="border-r-gray-medium w-2 border-r-[1px] py-0 pr-3 align-top">
            {isTopOfHour && (
                <>
                    <span className="text-gray-medium float-right hidden whitespace-nowrap text-[10px] font-bold md:flex md:text-xs">
                        {ZotDate.toTimeBlockString(timeBlock, false)}
                    </span>
                    <span className="text-gray-medium float-right flex whitespace-nowrap text-[10px] font-bold md:hidden md:text-xs">
                        {ZotDate.toTimeBlockString(timeBlock, true)}
                    </span>
                </>
            )}
        </td>
    );
}
