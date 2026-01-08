import React from "react";
import type { SelectMeeting } from "@/db/schema";
import { spacerBeforeDate } from "@/lib/availability/utils";
import type { ZotDate } from "@/lib/zotdate";

interface AvailabilityTableHeaderProps {
	currentPageAvailability: ZotDate[];
	meetingType: SelectMeeting["meetingType"];
}

export function AvailabilityTableHeader({
	currentPageAvailability,
	meetingType,
}: AvailabilityTableHeaderProps) {
	const spacers = spacerBeforeDate(currentPageAvailability);

	return (
		<thead>
			<tr>
				<th className="w-10 md:w-16">
					<span className="sr-only">Time</span>
				</th>

				{currentPageAvailability.map((dateHeader, index) => (
					<React.Fragment key={index}>
						{spacers[index] && (
							<th className="w-3 md:w-4" tabIndex={-1} aria-hidden="true" />
						)}
						<th className="text-sm font-normal">
							<div className="flex flex-col">
								<span className="text-[10px] font-bold uppercase text-gray-500 md:text-xs">
									{dateHeader?.day.toLocaleDateString("en-US", {
										weekday: "short",
									})}
								</span>
								{meetingType === "dates" && (
									<span className="text-center text-[12px] uppercase text-gray-medium md:text-base">
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
