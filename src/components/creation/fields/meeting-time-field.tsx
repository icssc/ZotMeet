import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { type Dispatch, type SetStateAction, useMemo } from "react";
import type { HourMinuteString } from "@/lib/types/chrono";

function hourMinuteStringToDate(time: HourMinuteString): Date {
	const [h = 0, m = 0, s = 0] = time
		.split(":")
		.map((part) => Number.parseInt(part, 10));
	const d = new Date();
	d.setHours(
		Number.isFinite(h) ? h : 0,
		Number.isFinite(m) ? m : 0,
		Number.isFinite(s) ? s : 0,
		0,
	);
	return d;
}

function dateToHourMinuteString(date: Date): HourMinuteString {
	const hh = date.getHours().toString().padStart(2, "0");
	const mm = date.getMinutes().toString().padStart(2, "0");
	return `${hh}:${mm}:00` as HourMinuteString;
}

interface MeetingTimeFieldProps {
	startTime: HourMinuteString;
	endTime: HourMinuteString;
	setStartTime: Dispatch<SetStateAction<HourMinuteString>>;
	setEndTime: Dispatch<SetStateAction<HourMinuteString>>;
}

export const MeetingTimeField = ({
	startTime,
	endTime,
	setStartTime,
	setEndTime,
}: MeetingTimeFieldProps) => {
	const startDate = useMemo(
		() => hourMinuteStringToDate(startTime),
		[startTime],
	);
	const endDate = useMemo(() => hourMinuteStringToDate(endTime), [endTime]);

	const slotProps = {
		textField: {
			fullWidth: true,
			size: "medium" as const,
			sx: {
				"& .MuiIconButton-edgeEnd": {
					marginRight: 0,
				},
			},
		},
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<div className="flex w-full flex-col items-center gap-4 md:flex-row">
				<TimePicker
					label="START TIME"
					value={startDate}
					onChange={(value) => {
						if (value) setStartTime(dateToHourMinuteString(value));
					}}
					slotProps={slotProps}
				/>
				<TimePicker
					label="END TIME"
					value={endDate}
					onChange={(value) => {
						if (value) setEndTime(dateToHourMinuteString(value));
					}}
					slotProps={slotProps}
				/>
			</div>
		</LocalizationProvider>
	);
};
