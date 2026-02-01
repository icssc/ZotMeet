import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

interface TimeZoneProps {
	TimeZone: string;
	changeTimeZone: (tz: string) => void;
	changeableTimezone: boolean;
}

export const TimeZoneDropdown = ({
	TimeZone,
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
				value={TimeZone}
				onChange={onTimeZoneChange}
				label="Time Zone"
			>
				<MenuItem value="Pacific/Funafuti">(UTC+12) Funafuti</MenuItem>
				<MenuItem value="Pacific/Pago_Pago">(UTC-11) Samoa</MenuItem>
				<MenuItem value="Pacific/Honolulu">(UTC-10) Hawaii</MenuItem>
				<MenuItem value="America/Anchorage">(UTC-9) Alaska</MenuItem>
				<MenuItem value="America/Los_Angeles">
					(UTC-8) Pacific Standard Time (PST)
				</MenuItem>
				<MenuItem value="America/Denver">
					(UTC-7) Mountain Standard Time (MST)
				</MenuItem>
				<MenuItem value="America/Chicago">
					(UTC-6) Central Standard Time (CST)
				</MenuItem>
				<MenuItem value="America/New_York">
					(UTC-5) Eastern Standard Time (EST)
				</MenuItem>
				<MenuItem value="America/Halifax">
					(UTC-4) Atlantic Time (Canada)
				</MenuItem>
				<MenuItem value="America/Sao_Paulo">
					(UTC-3) Brazil, Buenos Aires
				</MenuItem>
				<MenuItem value="Atlantic/South_Georgia">(UTC-2) Mid-Atlantic</MenuItem>
				<MenuItem value="Atlantic/Cape_Verde">(UTC-1) Cape Verde</MenuItem>
				<MenuItem value="Europe/London">
					(UTC+0) Greenwich Mean Time, Dublin
				</MenuItem>
				<MenuItem value="Europe/Berlin">(UTC+1) Berlin, Rome</MenuItem>
				<MenuItem value="Africa/Cairo">(UTC+2) Cairo</MenuItem>
				<MenuItem value="Europe/Moscow">(UTC+3) Moscow, Kuwait</MenuItem>
				<MenuItem value="Asia/Dubai">(UTC+4) Abu Dhabi, Muscat</MenuItem>
				<MenuItem value="Asia/Karachi">(UTC+5) Islamabad, Karachi</MenuItem>
				<MenuItem value="Asia/Dhaka">(UTC+6) Almaty, Dhaka</MenuItem>
				<MenuItem value="Asia/Bangkok">(UTC+7) Bangkok, Jakarta</MenuItem>
				<MenuItem value="Asia/Hong_Kong">(UTC+8) Hong Kong, Beijing</MenuItem>
				<MenuItem value="Asia/Tokyo">(UTC+9) Tokyo, Osaka</MenuItem>
				<MenuItem value="Australia/Sydney">(UTC+10) Sydney, Melbourne</MenuItem>
				<MenuItem value="Pacific/Guadalcanal">
					(UTC+11) Solomon Islands
				</MenuItem>
				<MenuItem value="Pacific/Auckland">
					(UTC+12) Auckland, Wellington
				</MenuItem>
			</Select>
		</FormControl>
	);
};
