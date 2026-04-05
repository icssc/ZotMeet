"use client";

import { AccessTime, CalendarMonth, Group } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import type { SelectMeeting } from "@/db/schema";
import {
	convertTimeFromUTC,
	formatDateToUSNumeric,
} from "@/lib/availability/utils";
import { isAnchorDateString, WEEKDAYS } from "@/lib/types/chrono";

const formatTime = (time: string): string => {
	const [hourStr] = time.split(":");
	let hour = parseInt(hourStr, 10);
	const ampm = hour >= 12 ? "PM" : "AM";
	hour = hour % 12 || 12;
	return `${hour} ${ampm}`;
};

interface MeetingCardProps {
	meeting: SelectMeeting;
}

const DateRange = ({
	dates,
	meetingType,
}: {
	dates: string[];
	meetingType: SelectMeeting["meetingType"];
}) => {
	if (!dates || dates.length === 0) return <>No dates specified</>;

	// Check if this is a days-of-week meeting with anchor dates.
	if (meetingType === "days") {
		const weekdayData = dates
			.map((dateStr) => {
				const dateString = dateStr.split("T")[0];
				if (isAnchorDateString(dateString)) {
					const date = new Date(dateStr);
					const dayIndex = date.getUTCDay();
					return { dayIndex, name: WEEKDAYS[dayIndex] };
				}
				return null;
			})
			.filter(Boolean) as { dayIndex: number; name: string }[];

		if (weekdayData.length > 0) {
			// Sort by day of week (Sun = 0, Mon = 1, ..., Sat = 6).
			const sortedWeekdays = weekdayData
				.sort((a, b) => a.dayIndex - b.dayIndex)
				.map((day) => day.name);
			return <>{sortedWeekdays.join(", ")}</>;
		}
	}

	// Regular date display for specific dates
	if (dates.length === 1) {
		return <>{formatDateToUSNumeric(new Date(dates[0]))}</>;
	}

	const sortedDates = [...dates].sort(
		(a, b) => new Date(a).getTime() - new Date(b).getTime(),
	);

	const first = formatDateToUSNumeric(new Date(sortedDates[0]));
	const last = formatDateToUSNumeric(
		new Date(sortedDates[sortedDates.length - 1]),
	);

	return <>{`${first} - ${last}`}</>;
};

export const MeetingCard = ({ meeting }: MeetingCardProps) => {
	const { title, fromTime, toTime, dates, meetingType } = meeting;

	// Convert UTC times to user's local timezone
	const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const referenceDate = dates[0];

	const fromTimeLocal = convertTimeFromUTC(
		fromTime,
		userTimezone,
		referenceDate,
	);
	const toTimeLocal = convertTimeFromUTC(toTime, userTimezone, referenceDate);

	return (
		<Box
			sx={(theme) => ({
				display: "flex",
				alignItems: "center",
				gap: 2,
				borderRadius: 3,
				border: `2px solid ${theme.palette.divider}`,
				bgcolor: theme.palette.background.paper,
				p: 3,
				pr: 4,
			})}
		>
			<Group fontSize="medium" />

			<Box sx={{ flexGrow: 1 }}>
				<Typography variant="h6" noWrap>
					{title}
				</Typography>

				<Box
					sx={{
						display: "flex",
						flexWrap: "wrap",
						alignItems: "center",
						gap: 2,
						fontWeight: 500,
						fontSize: 14,
						color: "text.secondary",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
						<CalendarMonth fontSize="small" />
						<span>
							<DateRange dates={dates} meetingType={meetingType} />
						</span>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
						<AccessTime fontSize="small" />
						<span>
							{formatTime(fromTimeLocal)} - {formatTime(toTimeLocal)}
						</span>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};
