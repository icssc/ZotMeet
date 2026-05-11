import { Typography } from "@mui/material";
import React from "react";
import { AvailabilityNavButton } from "@/components/availability/table/availability-nav-button";
import type { SelectMeeting } from "@/db/schema";
import {
	cloneBlocks,
	formatDateToUSNumeric,
	spacerBeforeDate,
} from "@/lib/availability/utils";
import type { ZotDate } from "@/lib/zotdate";

export interface AvailabilityDatePageNav {
	onPrev: () => void;
	onNext: () => void;
	isFirstPage: boolean;
	isLastPage: boolean;
}

interface AvailabilityTableHeaderProps {
	currentPageAvailability: {
		availabilities: (ZotDate | null)[];
		ifNeeded: (ZotDate | null)[];
	};
	meetingType: SelectMeeting["meetingType"];
	doesntNeedDay: boolean;
	datePageNav?: AvailabilityDatePageNav;
}

export function AvailabilityTableHeader({
	currentPageAvailability,
	meetingType,
	doesntNeedDay,
	datePageNav,
}: AvailabilityTableHeaderProps) {
	const newBlocks = cloneBlocks(
		currentPageAvailability.availabilities,
		doesntNeedDay,
	);

	const spacers = spacerBeforeDate(newBlocks);
	const lastIndex = newBlocks.length - 1;

	return (
		<thead>
			<tr>
				<th className="w-10 md:w-16">
					<span className="sr-only">Time</span>
				</th>

				{newBlocks.map((dateHeader, index) => {
					const dateContent = (
						<div className="flex w-full min-w-0 flex-col items-center text-center">
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
					);

					let cellInner: React.ReactNode = dateContent;
					if (datePageNav) {
						const n = newBlocks.length;
						const showLeft = n === 1 || index === 0;
						const showRight = n === 1 || index === lastIndex;
						if (showLeft || showRight) {
							cellInner = (
								<div className="relative flex min-h-11 w-full items-center justify-center py-0.5">
									{showLeft && (
										<span className="absolute top-1/2 left-0 z-[1] -translate-y-1/2">
											<AvailabilityNavButton
												direction="left"
												handleClick={datePageNav.onPrev}
												disabled={datePageNav.isFirstPage}
											/>
										</span>
									)}
									<div className="flex w-full justify-center px-9">
										{dateContent}
									</div>
									{showRight && (
										<span className="absolute top-1/2 right-0 z-[1] -translate-y-1/2">
											<AvailabilityNavButton
												direction="right"
												handleClick={datePageNav.onNext}
												disabled={datePageNav.isLastPage}
											/>
										</span>
									)}
								</div>
							);
						}
					}

					return (
						<React.Fragment key={index}>
							{spacers[index] && (
								<th className="w-3 md:w-4" tabIndex={-1} aria-hidden="true" />
							)}
							<th className="font-normal text-sm">{cellInner}</th>
						</React.Fragment>
					);
				})}
			</tr>
		</thead>
	);
}
