import { Box, Divider, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import {
	PickersLayout,
	type PickersLayoutProps,
} from "@mui/x-date-pickers/PickersLayout";
import { addDays } from "date-fns";

function CustomCalendarLayout(props: PickersLayoutProps<PickerValue>) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				px: 2,
				pb: 1.5,
			}}
		>
			<PickersLayout {...props} />
			<Divider />
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

	return (
		<DatePicker
			label="Date"
			value={date}
			onChange={onChange}
			slots={{ layout: CustomCalendarLayout }}
			slotProps={{ textField: { fullWidth: true } }}
			// limiting date range to today and 7 days from today
			minDate={today}
			maxDate={sevenDaysFromNow}
		/>
	);
}
