import { TextField, useMediaQuery, useTheme } from "@mui/material";
import type React from "react";
import { useState } from "react";

interface MeetingNameFieldProps {
	initialValue: string;
	onBlur: (value: string) => void;
}

export function MeetingNameField({
	initialValue,
	onBlur,
}: MeetingNameFieldProps) {
	const [value, setValue] = useState(initialValue);
	const theme = useTheme();
	const isSmallUp = useMediaQuery(theme.breakpoints.up("sm"));

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	return (
		<div className="w-full">
			<TextField
				fullWidth
				label="Meeting Name"
				variant={isSmallUp ? "standard" : "outlined"}
				size="medium"
				placeholder="Enter Meeting Name"
				value={value}
				onChange={handleChange}
				onBlur={() => onBlur(value)}
				autoFocus
			/>
		</div>
	);
}
