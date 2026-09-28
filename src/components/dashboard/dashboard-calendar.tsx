"use client";

import { Box } from "@mui/material";
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

/** `yyyy-MM-dd` keys of days that have a scheduled meeting. */
const MeetingDaysContext = createContext<Set<string>>(new Set());

function DayWithDot(props: PickersDayProps) {
	const meetingDays = useContext(MeetingDaysContext);
	const hasMeeting =
		!props.outsideCurrentMonth &&
		meetingDays.has(format(props.day, "yyyy-MM-dd"));

	return (
		<Box sx={{ position: "relative" }}>
			<PickersDay {...props} />
			{hasMeeting && (
				<Box
					aria-hidden
					sx={{
						position: "absolute",
						left: "50%",
						bottom: 2,
						width: 4,
						height: 4,
						ml: "-2px",
						borderRadius: "50%",
						bgcolor: "primary.main",
						pointerEvents: "none",
					}}
				/>
			)}
		</Box>
	);
}

/**
 * Month view with today highlighted and a dot under each day that has a
 * scheduled meeting. Read-only: the dashboard has no per-day view yet.
 */
export function DashboardCalendar({
	meetingDays,
}: {
	meetingDays: Set<string>;
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
