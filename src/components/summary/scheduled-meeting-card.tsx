"use client";

import {
	AccessTime,
	CalendarMonth,
	ExpandLess,
	ExpandMore,
	Group,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
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
		<Box
			sx={(theme) => ({
				borderRadius: 3,
				border: `2px solid ${theme.palette.divider}`,
				bgcolor: theme.palette.background.paper,
				p: 3,
			})}
		>
			<Box
				component="button"
				type="button"
				onClick={() => setExpanded((v) => !v)}
				sx={{
					display: "flex",
					width: "100%",
					alignItems: "center",
					gap: 2,
					textAlign: "left",
					background: "none",
					border: "none",
					cursor: "pointer",
				}}
			>
				<Link href={`/availability/${meeting.id}`} key={meeting.id}>
					<Group fontSize="medium" />
				</Link>

				<Box sx={{ flexGrow: 1 }}>
					<Link href={`/availability/${meeting.id}`} key={meeting.id}>
						<Typography variant="h6" noWrap>
							{meeting.title}
						</Typography>
					</Link>

					{/* Collapsed summary */}
					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							alignItems: "center",
							gap: 2,
							color: "text.secondary",
							fontSize: 14,
							fontWeight: 500,
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
							<CalendarMonth fontSize="small" />
							<span>{formatDateToUSNumeric(firstDay.date)}</span>
						</Box>

						<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
							<AccessTime fontSize="small" />
							<span>
								{(() => {
									const interval = mergeContiguousTimeBlocks(firstDay.blocks);
									if (!interval) return "—";
									return `${formatTimeWithHoursAndMins(interval.from)} - ${formatTimeWithHoursAndMins(interval.to)}`;
								})()}
							</span>
						</Box>

						{remainingCount > 0 && (
							<Typography variant="body2" color="text.secondary">
								+ {remainingCount} more
							</Typography>
						)}
					</Box>
				</Box>

				{expanded ? (
					<ExpandLess sx={{ color: "text.secondary" }} />
				) : (
					<ExpandMore sx={{ color: "text.secondary" }} />
				)}
			</Box>

			{/* Expanded view */}
			{expanded && (
				<Box
					sx={(theme) => ({
						mt: 2,
						pt: 2,
						borderTop: `1px solid ${theme.palette.divider}`,
						display: "flex",
						flexDirection: "column",
						gap: 2,
					})}
				>
					{blocksByDate.map(({ dateKey, date, blocks }) => (
						<Box key={dateKey}>
							<Typography fontWeight={600}>
								{formatDateToUSNumeric(date)}
							</Typography>

							<Box
								sx={{
									display: "flex",
									flexWrap: "wrap",
									gap: 1,
									mt: 0.5,
								}}
							>
								{(() => {
									const interval = mergeContiguousTimeBlocks(blocks);
									if (!interval) return null;

									return (
										<Box
											sx={(theme) => ({
												px: 1,
												py: 0.5,
												borderRadius: 1,
												fontSize: 13,
												bgcolor:
													theme.palette.mode === "dark"
														? "rgba(255,255,255,0.08)"
														: "rgba(0,0,0,0.06)",
											})}
										>
											{formatTimeWithHoursAndMins(interval.from)}–
											{formatTimeWithHoursAndMins(interval.to)}
										</Box>
									);
								})()}
							</Box>
						</Box>
					))}
				</Box>
			)}
		</Box>
	);
};
