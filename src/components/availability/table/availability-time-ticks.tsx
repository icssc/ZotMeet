import { memo } from "react";
import { ZotDate } from "@/lib/zotdate";

interface AvailabilityTimeTicksProps {
	timeBlock: number;
}
const MINUTES_PER_DAY = 1440;

export const AvailabilityTimeTicks = memo(
	({ timeBlock }: AvailabilityTimeTicksProps) => {
		const minutesInDay = timeBlock % MINUTES_PER_DAY;
		const isTopOfHour = minutesInDay % 60 === 0;
		return (
			<td className="w-2 border-r-[1px] border-r-gray-medium py-0 pr-3 align-top">
				{isTopOfHour && (
					<>
						<span className="float-right hidden whitespace-nowrap font-bold text-[10px] text-gray-medium md:flex md:text-xs">
							{ZotDate.toTimeBlockString(minutesInDay, false)}
						</span>
						<span className="float-right flex whitespace-nowrap font-bold text-[10px] text-gray-medium md:hidden md:text-xs">
							{ZotDate.toTimeBlockString(minutesInDay, true)}
						</span>
					</>
				)}
			</td>
		);
	},
);

AvailabilityTimeTicks.displayName = "AvailabilityTimeTicks";
