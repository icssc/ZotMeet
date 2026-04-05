import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import type React from "react";
import type { Dispatch, SetStateAction } from "react";

interface MeetingLocationFieldProps {
	meetingLocation: string;
	setMeetingLocation: Dispatch<SetStateAction<string>>;
	recommendation: boolean;
	setRecommendation: Dispatch<SetStateAction<boolean>>;
}

export function MeetingLocationField({
	meetingLocation,
	setMeetingLocation,
	recommendation,
	setRecommendation,
}: MeetingLocationFieldProps) {
	const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMeetingLocation(e.target.value);
	};
	const handleRecommendationChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRecommendation(e.target.checked);
	};

	return (
		<div className="flex flex-col gap-x-4 text-gray-500 text-lg">
			<TextField
				fullWidth
				label="MEETING LOCATION"
				variant="outlined"
				size="medium"
				placeholder="Location"
				value={meetingLocation}
				onChange={handleLocationChange}
			/>
			<FormControlLabel
				control={
					<Checkbox
						checked={recommendation}
						onChange={handleRecommendationChange}
					/>
				}
				label="Recommend rooms based on responses"
			/>
		</div>
	);
}
