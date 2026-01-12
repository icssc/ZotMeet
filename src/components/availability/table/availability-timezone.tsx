import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";

interface TimeZoneProps {
	TimeZone: string;
	changeTimeZone: (tz: string) => void;
}

export const TimeZoneDropdown = ({
	TimeZone,
	changeTimeZone,
}: TimeZoneProps) => {
	const onTimeZoneChange = (event: SelectChangeEvent) => {
		//console.log(TimeZone, changeTimeZone);
		changeTimeZone(event.target.value);
	};
	const GMT_dict: Record<string, string> = {
		"America/Los_Angeles": "Etc/GMT+8",
		"America/New_York": "Etc/GMT+5",
	};
	return (
		<FormControl variant="standard">
			<InputLabel id="TimeZone-Switcher-Label">Select Time Zone:</InputLabel>
			<Select
				labelId="TimeZone-Switcher-Label"
				id="TimeZone-Selector"
				value={TimeZone in GMT_dict ? GMT_dict[TimeZone] : TimeZone}
				onChange={onTimeZoneChange}
				label="Time Zone"
			>
				<MenuItem value={"Etc/GMT+12"}> (UTC-12) Eniwetok </MenuItem>
				<MenuItem value={"Etc/GMT+11"}> (UTC-11) Samoa </MenuItem>
				<MenuItem value={"Etc/GMT+10"}> (UTC-10) Hawaii </MenuItem>
				<MenuItem value={"Etc/GMT+9"}> (UTC-9) Alaska </MenuItem>
				<MenuItem value={"Etc/GMT+8"}>
					{" "}
					(UTC-8) Pacific Standard Time (PST){" "}
				</MenuItem>
				<MenuItem value={"Etc/GMT+7"}>
					{" "}
					(UTC-7) Mountain Standard Time (MST){" "}
				</MenuItem>
				<MenuItem value={"Etc/GMT+6"}>
					{" "}
					(UTC-6) Central Standard Time (CST)
				</MenuItem>
				<MenuItem value={"Etc/GMT+5"}>
					{" "}
					(UTC-5) Eastern Standard Time (EST){" "}
				</MenuItem>
				<MenuItem value={"Etc/GMT+4"}> (UTC-4) Atlantic/Canada </MenuItem>
				<MenuItem value={"Etc/GMT+3"}> (UTC-3) Brazil, Buenos Aries </MenuItem>
				<MenuItem value={"Etc/GMT+2"}> (UTC-2) Mid-Atlantic </MenuItem>
				<MenuItem value={"Etc/GMT+1"}> (UTC-1) Cape Verdes </MenuItem>
				<MenuItem value={"Etc/GMT"}>
					{" "}
					(UTC-0) Greenwich Mean Time, Dublin{" "}
				</MenuItem>
				<MenuItem value={"Etc/GMT-1"}> (UTC+1) Berlin, Rome </MenuItem>
				<MenuItem value={"Etc/GMT-2"}> (UTC+2) Cairo </MenuItem>
				<MenuItem value={"Etc/GMT-3"}> (UTC+3) Moscow, Kuwait </MenuItem>
				<MenuItem value={"Etc/GMT-4"}> (UTC+4) Abu Dhabi, Muscat </MenuItem>
				<MenuItem value={"Etc/GMT-5"}> (UTC+5) Islamabad, Karachi </MenuItem>
				<MenuItem value={"Etc/GMT-6"}> (UTC+6) Almaty, Dhaka </MenuItem>
				<MenuItem value={"Etc/GMT-7"}> (UTC+7) Bangkok, Jakarta </MenuItem>
				<MenuItem value={"Etc/GMT-8"}> (UTC+8) Hong Kong, Beijing </MenuItem>
				<MenuItem value={"Etc/GMT-9"}> (UTC+9) Tokyo, Osaka </MenuItem>
				<MenuItem value={"Etc/GMT-10"}>
					{" "}
					(UTC+10) Sydney, Melbourne, Guam{" "}
				</MenuItem>
				<MenuItem value={"Etc/GMT-11"}>
					{" "}
					(UTC+11) Magadan, Soloman Islands{" "}
				</MenuItem>
				<MenuItem value={"Etc/GMT-12"}>
					{" "}
					(UTC+12) Fiji, Wellington, Auckland{" "}
				</MenuItem>
			</Select>
		</FormControl>
	);
};
