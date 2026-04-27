import { Typography } from "@mui/material";
import React from "react";
import type { SelectMeeting } from "@/db/schema";
import {
	formatDateToUSNumeric,
	newZonedPageAvailAndDates,
	spacerBeforeDate,
} from "@/lib/availability/utils";
import type { ZotDate } from "@/lib/zotdate";

interface AvailabilityTableHeaderProps {
	currentPageAvailability: {
		availabilities: (ZotDate | null)[];
		ifNeeded: (ZotDate | null)[];
	};
	meetingType: SelectMeeting["meetingType"];
	doesntNeedDay: boolean;
}

export function AvailabilityTableHeader({
	currentPageAvailability,
	meetingType,
	doesntNeedDay,
}: AvailabilityTableHeaderProps) {
	//extra day calculation for day spillover
	//put in here to prevent infinite adding, recalculates everytime something changes
	const [newBlocks, _newAvailDates] = newZonedPageAvailAndDates(
		currentPageAvailability.availabilities,
		null,
		doesntNeedDay,
	);

	const spacers = spacerBeforeDate(newBlocks);
	return (
		<thead>
			<tr>
				<th className="w-10 md:w-16">
					<span className="sr-only">Time</span>
				</th>

				{newBlocks.map((dateHeader, index) => (
					<React.Fragment key={index}>
						{spacers[index] && (
							<th className="w-3 md:w-4" tabIndex={-1} aria-hidden="true" />
						)}
						<th className="font-normal text-sm">
							<div className="flex flex-col">
								<Typography
									variant="caption"
									color="textSecondary"
									className="uppercase"
								>
									{dateHeader?.day.toLocaleDateString("en-US", {
										weekday: "short",
									})}
								</Typography>

								{meetingType === "dates" && (
									<Typography>
										{dateHeader?.day && formatDateToUSNumeric(dateHeader.day)}
									</Typography>
								)}
							</div>
						</th>
					</React.Fragment>
				))}
			</tr>
		</thead>
	);
}
