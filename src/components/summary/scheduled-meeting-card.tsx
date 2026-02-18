"use client";

import {
	AccessTime,
	CalendarMonth,
	ExpandLess,
	ExpandMore,
	Group,
} from "@mui/icons-material";
import { useMemo, useState } from "react";
import type { SelectMeeting, SelectScheduledMeeting } from "@/db/schema";
import {
	formatDateToUSNumeric,
	formatTimeWithHoursAndMins,
} from "@/lib/availability/utils";
import {
	groupScheduledBlocksByDate,
	mergeContiguousTimeBlocks,
} from "@/lib/meetings/utils";

interface ScheduledMeetingCardProps {
	meeting: SelectMeeting;
	scheduledTimeBlocks?: SelectScheduledMeeting[];
}
export const ScheduledMeetingCard = ({
	meeting,
	scheduledTimeBlocks,
}: ScheduledMeetingCardProps) => {
	const [expanded, setExpanded] = useState(false);

	const blocksByDate = useMemo(
		() => groupScheduledBlocksByDate(scheduledTimeBlocks ?? []),
		[scheduledTimeBlocks],
	);

	if (blocksByDate.length === 0) return null;

	const firstDay = blocksByDate[0];
	const remainingCount = blocksByDate.length - 1;

	return (
		<div className="rounded-xl border-2 border-gray-200 bg-[#F9FAFB] p-6">
			<button
				type="button"
				onClick={() => setExpanded((v) => !v)}
				className="flex w-full items-start items-center gap-4 text-left"
				aria-expanded={expanded}
			>
				<a href={`/availability/${meeting.id}`}>
					<Group className="size-10 shrink-0 rounded-full text-gray-500" />
				</a>
				<div className="flex-grow space-y-1">
					<a href={`/availability/${meeting.id}`}>
						<h3 className="truncate font-dm-sans font-medium text-gray-800 text-xl">
							{meeting.title}
						</h3>
					</a>

					{/* Collapsed summary */}
					<div className="flex flex-row flex-wrap items-center gap-x-4 font-dm-sans font-semibold text-gray-500 text-sm">
						<div className="flex flex-nowrap items-center gap-x-1">
							<CalendarMonth className="size-4" />
							<span className="p text-nowrap">
								{formatDateToUSNumeric(firstDay.date)}
							</span>
						</div>

						<div className="flex flex-nowrap items-center gap-x-1">
							<AccessTime className="size-4" />
							<span className="p text-nowrap">
								{mergeContiguousTimeBlocks(firstDay.blocks)
									.map(
										(interval) =>
											`${formatTimeWithHoursAndMins(interval.from)} - ${formatTimeWithHoursAndMins(interval.to)}`,
									)
									.join(", ")}
							</span>
						</div>

						{remainingCount > 0 && (
							<span className="p text-nowrap text-gray-500">
								+ {remainingCount} more
							</span>
						)}
					</div>
				</div>

				{expanded ? (
					<ExpandLess className="mt-1 size-5 text-gray-400" />
				) : (
					<ExpandMore className="mt-1 size-5 text-gray-400" />
				)}
			</button>

			{/* Expanded view */}
			{expanded && (
				<div className="mt-4 space-y-3 border-t pt-4">
					{blocksByDate.map(({ dateKey, date, blocks }) => (
						<div key={dateKey} className="space-y-1">
							<div className="font-dm-sans font-semibold text-gray-700">
								{formatDateToUSNumeric(date)}
							</div>

							<div className="flex flex-wrap gap-2 text-gray-600 text-sm">
								{mergeContiguousTimeBlocks(blocks).map((interval, index) => (
									<span
										key={index}
										className="rounded-md bg-gray-100 px-2 py-1"
									>
										{formatTimeWithHoursAndMins(interval.from)}–
										{formatTimeWithHoursAndMins(interval.to)}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
