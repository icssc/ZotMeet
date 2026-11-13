import { Typography } from "@mui/material";
import { memo } from "react";
import { TimeConstants } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";

interface AvailabilityTimeTicksProps {
	timeBlock: number;
}

export const AvailabilityTimeTicks = memo(
	({ timeBlock }: AvailabilityTimeTicksProps) => {
		const minutesInDay = timeBlock % TimeConstants.MINUTES_PER_DAY;
		const isTopOfHour = minutesInDay % 60 === 0;
		return (
			<td className="w-2 border-r-[1px] border-r-gray-medium bg-paper py-0 pr-3 align-top">
				{isTopOfHour && (
					<>
						<Typography
							variant="caption"
							color="textSecondary"
							className="float-right hidden whitespace-nowrap md:flex"
						>
							{ZotDate.toTimeBlockString(minutesInDay, true)}
						</Typography>

						<Typography
							variant="caption"
							color="textSecondary"
							className="float-right flex whitespace-nowrap md:hidden"
						>
							{ZotDate.toTimeBlockString(minutesInDay, true)}
						</Typography>
					</>
				)}
			</td>
		);
	},
);

AvailabilityTimeTicks.displayName = "AvailabilityTimeTicks";
