import { Box, Divider, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import {
	PickersLayout,
	type PickersLayoutProps,
} from "@mui/x-date-pickers/PickersLayout";
import { addDays, getWeeksInMonth } from "date-fns";
import { useState } from "react";

const ROW_HEIGHT = 40;

function CustomCalendarLayout(props: PickersLayoutProps<PickerValue>) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<PickersLayout {...props} />
			<Divider sx={{ py: 0.5 }} />
			<Typography
				variant="caption"
				sx={{ px: 2, py: 1.5, display: "block", maxWidth: 320 }}
			>
				Anteater API doesn't support room bookings more than 7 days in advance.
			</Typography>
		</Box>
	);
}

interface LimitedDatePickerProps {
	date: Date | null;
	onChange: React.Dispatch<React.SetStateAction<Date | null>>;
}
export default function LimitedDatePicker({
	date,
	onChange,
}: LimitedDatePickerProps) {
	const today = new Date();
	const sevenDaysFromNow = addDays(today, 7);
	const [visibleMonth, setVisibleMonth] = useState<Date>(date ?? today);

	// Styles to hide buttons if disabled
	const hideWhenDisabled = {
		"&.Mui-disabled": {
			display: "none",
		},
	};

	return (
		<DatePicker
			label="Date"
			value={date}
			onChange={onChange}
			// Keep track of which month is shown to user
			onOpen={() => setVisibleMonth(date ?? today)}
			onMonthChange={(newMonth) => setVisibleMonth(newMonth)}
			slots={{ layout: CustomCalendarLayout }}
			slotProps={{
				textField: { fullWidth: true },
				layout: {
					sx: {
						// Adjust height of the month calendar based on how
						// many rows of days (weeks) are displayed
						"& .MuiDateCalendar-root": { height: "auto" },
						"& .MuiDayCalendar-slideTransition": {
							minHeight: getWeeksInMonth(visibleMonth) * ROW_HEIGHT,
						},
					},
				},

				// Don't display arrow navigation buttons if disabled
				previousIconButton: { sx: hideWhenDisabled },
				nextIconButton: { sx: hideWhenDisabled },
			}}
			// Limit date range to today and 7 days from today
			minDate={today}
			maxDate={sevenDaysFromNow}
		/>
	);
}
