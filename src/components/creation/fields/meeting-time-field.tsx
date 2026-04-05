import { TextField } from "@mui/material";
import { type Dispatch, type SetStateAction, useState } from "react";
import type { HourMinuteString } from "@/lib/types/chrono";

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
	return (
		<div>
			{/* <div className="flex w-full flex-col items-center space-y-4 pt-2 text-gray-500 text-sm"> */}
			<div className="flex w-full flex-col items-center gap-4 md:flex-row">
				<TextField
					fullWidth
					label="START TIME"
					variant="outlined"
					type="time"
					size="medium"
					placeholder="9:00 AM"
					value={startTime}
					onChange={(e) =>
						setStartTime(`${e.target.value}:00` as HourMinuteString)
					}
				/>

				<TextField
					fullWidth
					label="END TIME"
					variant="outlined"
					type="time"
					size="medium"
					placeholder="5:00 PM"
					value={endTime}
					onChange={(e) =>
						setEndTime(`${e.target.value}:00` as HourMinuteString)
					}
				/>
				<div className="flex gap-2"></div>
			</div>
		</div>
	);
};
