import { Typography } from "@mui/material";
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
						<Typography
							variant="caption"
							color="textSecondary"
							className="float-right hidden whitespace-nowrap md:flex"
						>
							{ZotDate.toTimeBlockString(minutesInDay, true)}
						</Typography>

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
