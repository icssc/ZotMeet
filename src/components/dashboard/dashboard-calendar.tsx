"use client";

import { Box, Tooltip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
	PickersDay,
	type PickersDayProps,
} from "@mui/x-date-pickers/PickersDay";
import { format } from "date-fns";
import { createContext, useContext } from "react";

export type CalendarMeeting = { id: string; title: string; time: string };

/** Scheduled meetings by `yyyy-MM-dd` day, in start-time order. */
const MeetingDaysContext = createContext<Map<string, CalendarMeeting[]>>(
	new Map(),
);

function DayWithDot(props: PickersDayProps) {
	const meetingDays = useContext(MeetingDaysContext);
	const meetings = props.outsideCurrentMonth
		? undefined
		: meetingDays.get(format(props.day, "yyyy-MM-dd"));

	const day = (
		<Box sx={{ position: "relative" }}>
			<PickersDay {...props} />
			{meetings && (
				<Box
					aria-hidden
					sx={{
						position: "absolute",
						left: "50%",
						bottom: 2,
						width: 4,
						height: 4,
						transform: "translateX(-50%)",
						borderRadius: "50%",
						bgcolor: "primary.main",
						pointerEvents: "none",
					}}
				/>
			)}
		</Box>
	);

	if (!meetings) return day;
	return (
		<Tooltip
			placement="top"
			title={
				<Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
					{meetings.map((m) => (
						<li key={m.id}>
							{m.title} · {m.time}
						</li>
					))}
				</Box>
			}
		>
			{day}
		</Tooltip>
	);
}

/**
 * Month view with today highlighted and a dot under each day that has a
 * scheduled meeting; hovering the day lists them. Read-only: the dashboard
 * has no per-day view yet.
 */
export function DashboardCalendar({
	meetingDays,
}: {
	meetingDays: Map<string, CalendarMeeting[]>;
}) {
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<MeetingDaysContext.Provider value={meetingDays}>
				<DateCalendar
					readOnly
					value={null}
					views={["month", "day"]}
					slots={{ day: DayWithDot }}
					sx={(theme) => ({
						width: "100%",
						maxWidth: "none",
						height: "auto",
						maxHeight: "none",
						"& .MuiPickersCalendarHeader-root": { pl: 3, pr: 1.5, mt: 2 },
						"& .MuiPickersCalendarHeader-label": { typography: "subtitle1" },
						"& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer": {
							justifyContent: "space-around",
						},
						"& .MuiDayCalendar-weekDayLabel": {
							typography: "body2",
							color: "text.secondary",
						},
						"& .MuiDayCalendar-slideTransition": { minHeight: 264 },
						"& .MuiPickersDay-root": { typography: "body2" },
						"& .MuiPickersDay-root.MuiPickersDay-today:not(.Mui-selected)": {
							border: 0,
							bgcolor: alpha(theme.palette.primary.main, 0.2),
						},
					})}
				/>
			</MeetingDaysContext.Provider>
		</LocalizationProvider>
	);
}
