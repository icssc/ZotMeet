import { TextField, useMediaQuery, useTheme } from "@mui/material";
import type React from "react";
import type { Dispatch, SetStateAction } from "react";

interface MeetingNameFieldProps {
	meetingName: string;
	setMeetingName: Dispatch<SetStateAction<string>>;
}

export function MeetingNameField({
	meetingName,
	setMeetingName,
}: MeetingNameFieldProps) {
	const theme = useTheme();
	const isSmallUp = useMediaQuery(theme.breakpoints.up("sm"));

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMeetingName(e.target.value);
	};

	return (
		<div className="w-full">
			<TextField
				fullWidth
				label="Meeting Name"
				variant={isSmallUp ? "standard" : "outlined"}
				size="medium"
				placeholder="Enter Meeting Name"
				value={meetingName}
				onChange={handleChange}
				autoFocus
			/>
		</div>
	);
}
