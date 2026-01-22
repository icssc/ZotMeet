import React from "react";
import type { SelectMeeting } from "@/db/schema";
import { spacerBeforeDate } from "@/lib/availability/utils";
import { ZotDate } from "@/lib/zotdate";

interface AvailabilityTableHeaderProps {
	currentPageAvailability: ZotDate[];
	meetingType: SelectMeeting["meetingType"];
	timeblocks: number[];
}

export function AvailabilityTableHeader({
	currentPageAvailability,
	meetingType,
	timeblocks,
}: AvailabilityTableHeaderProps) {
	//extra day calculation for day spillover
	//put in here to prevent infinite adding, recalculates everytime something changes
	let doesntNeedDay = true;
	let past = timeblocks[0];
	timeblocks.forEach((minutes, index) => {
		if (index !== 0 && minutes - past !== 15) {
			doesntNeedDay = false;
		}
		past = timeblocks[index];
	});
	const newBlocks = structuredClone(currentPageAvailability);
	let dayIndex = currentPageAvailability.length - 1;
	while (currentPageAvailability[dayIndex] == null) {
		dayIndex -= 1;
	}
	if (!doesntNeedDay) {
		const prevDay = currentPageAvailability[dayIndex];
		console.log(currentPageAvailability);
		const newDay = new Date(prevDay.day);
		newDay.setDate(newDay.getDate() + 1);
		newBlocks[dayIndex + 1] = new ZotDate(
			newDay,
			prevDay.earliestTime,
			prevDay.latestTime,
			false,
			[],
			{},
		);
	}
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
										{dateHeader?.day.toLocaleDateString("en-US", {
											month: "numeric",
											day: "numeric",
										})}
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
