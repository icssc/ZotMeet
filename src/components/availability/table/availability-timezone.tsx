import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { TIMEZONES } from "@/lib/constants/timezones";

interface TimeZoneProps {
	timeZone: string;
	changeTimeZone: (tz: string) => void;
	changeableTimezone: boolean;
}

export const TimeZoneDropdown = ({
	timeZone,
	changeTimeZone,
	changeableTimezone,
}: TimeZoneProps) => {
	const onTimeZoneChange = (event: SelectChangeEvent) => {
		changeTimeZone(event.target.value);
	};

	return (
		<FormControl
			variant="standard"
			disabled={!changeableTimezone}
			sx={{ width: 400 }}
		>
			<InputLabel id="TimeZone-Switcher-Label">Select Time Zone:</InputLabel>
			<Select
				labelId="TimeZone-Switcher-Label"
				id="TimeZone-Selector"
				value={timeZone}
				onChange={onTimeZoneChange}
				label="Time Zone"
			>
				{TIMEZONES.map((tz) => (
					<MenuItem key={tz.value} value={tz.value}>
						{tz.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};
