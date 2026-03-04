import React from "react";
import type { SelectMeeting } from "@/db/schema";
import {
	formatDateToUSNumeric,
	newZonedPageAvailAndDates,
	spacerBeforeDate,
} from "@/lib/availability/utils";
import type { ZotDate } from "@/lib/zotdate";

interface AvailabilityTableHeaderProps {
	currentPageAvailability: ZotDate[];
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
	const [newBlocks, newAvailDates] = newZonedPageAvailAndDates(
		currentPageAvailability,
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
								<span className="font-bold text-[10px] text-gray-500 uppercase md:text-xs">
									{dateHeader?.day.toLocaleDateString("en-US", {
										weekday: "short",
									})}
								</span>
								{meetingType === "dates" && (
									<span className="text-center text-[12px] text-gray-medium uppercase md:text-base">
										{dateHeader?.day && formatDateToUSNumeric(dateHeader.day)}
									</span>
								)}
							</div>
						</th>
					</React.Fragment>
				))}
			</tr>
		</thead>
	);
}
