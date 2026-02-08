export interface TimeZone {
	value: string;
	label: string;
}

export const TIMEZONES: TimeZone[] = [
	{ value: "Pacific/Funafuti", label: "(UTC+12) Funafuti" },
	{ value: "Pacific/Pago_Pago", label: "(UTC-11) Samoa" },
	{ value: "Pacific/Honolulu", label: "(UTC-10) Hawaii" },
	{ value: "America/Anchorage", label: "(UTC-9) Alaska" },
	{
		value: "America/Los_Angeles",
		label: "(UTC-8) Pacific Standard Time (PST)",
	},
	{
		value: "America/Denver",
		label: "(UTC-7) Mountain Standard Time (MST)",
	},
	{
		value: "America/Chicago",
		label: "(UTC-6) Central Standard Time (CST)",
	},
	{
		value: "America/New_York",
		label: "(UTC-5) Eastern Standard Time (EST)",
	},
	{ value: "America/Halifax", label: "(UTC-4) Atlantic Time (Canada)" },
	{ value: "America/Sao_Paulo", label: "(UTC-3) Brazil, Buenos Aires" },
	{ value: "Atlantic/South_Georgia", label: "(UTC-2) Mid-Atlantic" },
	{ value: "Atlantic/Cape_Verde", label: "(UTC-1) Cape Verde" },
	{
		value: "Europe/London",
		label: "(UTC+0) Greenwich Mean Time, Dublin",
	},
	{ value: "Europe/Berlin", label: "(UTC+1) Berlin, Rome" },
	{ value: "Africa/Cairo", label: "(UTC+2) Cairo" },
	{ value: "Europe/Moscow", label: "(UTC+3) Moscow, Kuwait" },
	{ value: "Asia/Dubai", label: "(UTC+4) Abu Dhabi, Muscat" },
	{ value: "Asia/Karachi", label: "(UTC+5) Islamabad, Karachi" },
	{ value: "Asia/Dhaka", label: "(UTC+6) Almaty, Dhaka" },
	{ value: "Asia/Bangkok", label: "(UTC+7) Bangkok, Jakarta" },
	{ value: "Asia/Hong_Kong", label: "(UTC+8) Hong Kong, Beijing" },
	{ value: "Asia/Tokyo", label: "(UTC+9) Tokyo, Osaka" },
	{ value: "Australia/Sydney", label: "(UTC+10) Sydney, Melbourne" },
	{ value: "Pacific/Guadalcanal", label: "(UTC+11) Solomon Islands" },
	{ value: "Pacific/Auckland", label: "(UTC+12) Auckland, Wellington" },
];
