"use client";

import {
	Calendar,
	ChevronDown,
	ChevronUp,
	Clock,
	UsersIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { SelectMeeting, SelectScheduledMeeting } from "@/db/schema";
import {
	formatDateToUSNumeric,
	formatTimeWithHoursAndMins,
} from "@/lib/availability/utils";

interface ScheduledMeetingCardProps {
	meeting: SelectMeeting;
	scheduledTimeBlocks?: SelectScheduledMeeting[];
}

interface TimeInterval {
	from: string;
	to: string;
}

// Merge 15-min contiguous blocks
const mergeContiguousTimeBlocks = (
	blocks: SelectScheduledMeeting[],
): TimeInterval[] => {
	if (blocks.length === 0) return [];

	// Sort by start time
	const sorted = [...blocks].sort((a, b) =>
		a.scheduledFromTime.localeCompare(b.scheduledFromTime),
	);

	const merged: TimeInterval[] = [];
	let current: TimeInterval = {
		from: sorted[0].scheduledFromTime,
		to: sorted[0].scheduledToTime,
	};

	for (let i = 1; i < sorted.length; i++) {
		const block = sorted[i];
		if (block.scheduledFromTime === current.to) {
			// extend current
			current.to = block.scheduledToTime;
		} else {
			merged.push(current);
			current = { from: block.scheduledFromTime, to: block.scheduledToTime };
		}
	}

	// push last interval
	merged.push(current);
	return merged;
};

export const ScheduledMeetingCard = ({
	meeting,
	scheduledTimeBlocks,
}: ScheduledMeetingCardProps) => {
	const [expanded, setExpanded] = useState(false);

	// Group scheduled blocks by date (YYYY-MM-DD)
	const blocksByDate = useMemo(() => {
		const map = new Map<string, SelectScheduledMeeting[]>();

		for (const block of scheduledTimeBlocks ?? []) {
			const key = block.scheduledDate.toISOString().split("T")[0];
			if (!map.has(key)) map.set(key, []);
			map.get(key)?.push(block);
		}

		return [...map.entries()]
			.map(([dateKey, blocks]) => ({
				dateKey,
				date: blocks[0].scheduledDate,
				blocks,
			}))
			.sort((a, b) => a.date.getTime() - b.date.getTime());
	}, [scheduledTimeBlocks]);

	if (blocksByDate.length === 0) return null;

	const firstDay = blocksByDate[0];
	const remainingCount = blocksByDate.length - 1;

	return (
		<div className="rounded-xl border-2 border-gray-200 bg-[#F9FAFB] p-6">
			<button
				type="button"
				onClick={() => setExpanded((v) => !v)}
				className="flex w-full items-start gap-4 text-left"
				aria-expanded={expanded}
			>
				<a href={`/availability/${meeting.id}`}>
					<UsersIcon className="size-10 shrink-0 rounded-full border-2 border-gray-200 p-2 text-gray-500" />
				</a>
				<div className="flex-grow space-y-2">
					<a href={`/availability/${meeting.id}`}>
						<h3 className="truncate font-dm-sans font-medium text-gray-800 text-xl">
							{meeting.title}
						</h3>
					</a>

					{/* Collapsed summary */}
					<div className="flex flex-row flex-wrap items-center gap-x-4 font-dm-sans font-semibold text-gray-500 text-sm">
						<div className="flex flex-nowrap items-center gap-x-1">
							<Calendar className="size-4" />
							<span className="p text-nowrap">
								{formatDateToUSNumeric(firstDay.date)}
							</span>
						</div>

						<div className="flex flex-nowrap items-center gap-x-1">
							<Clock className="size-4" />
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
					<ChevronUp className="mt-1 size-5 text-gray-400" />
				) : (
					<ChevronDown className="mt-1 size-5 text-gray-400" />
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
