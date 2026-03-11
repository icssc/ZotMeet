import { TextField } from "@mui/material";
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
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMeetingName(e.target.value);
	};

	return (
		<div className="flex w-full flex-row items-center gap-x-4 text-gray-500 text-lg">
			<TextField
				fullWidth
				label="MEETING TITLE"
				variant="standard"
				size="medium"
				placeholder="9:00 AM"
				value={meetingName}
				onChange={handleChange}
				autoFocus
			/>
		</div>
	);
}
