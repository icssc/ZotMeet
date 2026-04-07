import { editMeeting } from "@actions/meeting/edit/action";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Calendar } from "@/components/creation/calendar/calendar";
import { MeetingNameField } from "@/components/creation/fields/meeting-name-field";
import { MeetingTimeField } from "@/components/creation/fields/meeting-time-field";
import type { SelectMeeting } from "@/db/schema";
import { convertTimeFromUTC, convertTimeToUTC } from "@/lib/availability/utils";
import type { HourMinuteString } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";

interface EditModalProps {
	meetingData: SelectMeeting;
	isOpen: boolean;
	handleOpenChange: (open: boolean) => void;
}

export const EditModal = ({
	meetingData,
	isOpen,
	handleOpenChange,
}: EditModalProps) => {
	const userTimezone = useMemo(
		() => Intl.DateTimeFormat().resolvedOptions().timeZone,
		[],
	);
	const referenceDate = meetingData.dates[0];

	const fromTimeLocal = useMemo(
		() => convertTimeFromUTC(meetingData.fromTime, userTimezone, referenceDate),
		[meetingData.fromTime, userTimezone, referenceDate],
	);

	const toTimeLocal = useMemo(
		() => convertTimeFromUTC(meetingData.toTime, userTimezone, referenceDate),
		[meetingData.toTime, userTimezone, referenceDate],
	);

	const [selectedDays, setSelectedDays] = useState<ZotDate[]>(
		meetingData.dates.map((date) => new ZotDate(new Date(date))),
	);
	const [startTime, setStartTime] = useState<HourMinuteString>(
		fromTimeLocal as HourMinuteString,
	);
	const [endTime, setEndTime] = useState<HourMinuteString>(
		toTimeLocal as HourMinuteString,
	);
	const [meetingName, setMeetingName] = useState(meetingData.title);
	const [meetingType, setMeetingType] = useState<SelectMeeting["meetingType"]>(
		meetingData.meetingType,
	);

	const handleEditClick = async () => {
		const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const dates = selectedDays.map((zotDate) => zotDate.day.toISOString());

		const referenceDate = dates[0];
		const fromTimeUTC = convertTimeToUTC(
			startTime,
			userTimezone,
			referenceDate,
		);
		const toTimeUTC = convertTimeToUTC(endTime, userTimezone, referenceDate);

		const updatedMeetingData = {
			title: meetingName,
			description: meetingData.description || "",
			fromTime: fromTimeUTC,
			toTime: toTimeUTC,
			timezone: userTimezone,
			dates,
			meetingType,
		};

		const updatedMeeting = {
			...meetingData,
			...updatedMeetingData,
		};

		const { success, error } = await editMeeting(updatedMeeting);

		if (success) {
			toast.success("Meeting updated successfully!");
			window.location.reload();
		} else {
			toast.error(error);
		}

		handleOpenChange(false);
	};

	const hasValidInputs = useMemo(() => {
		return (
			selectedDays.length > 0 &&
			startTime &&
			endTime &&
			startTime < endTime &&
			meetingName
		);
	}, [selectedDays.length, startTime, endTime, meetingName]);

	return (
		<Dialog
			open={isOpen}
			onClose={() => handleOpenChange(false)}
			maxWidth="lg"
			fullWidth
		>
			<DialogTitle>Edit Meeting</DialogTitle>

			<DialogContent>
				<div className="flex flex-col space-y-6 pt-2">
					<MeetingNameField
						meetingName={meetingName}
						setMeetingName={setMeetingName}
					/>

					<MeetingTimeField
						startTime={startTime}
						setStartTime={setStartTime}
						endTime={endTime}
						setEndTime={setEndTime}
					/>

					<Calendar
						selectedDays={selectedDays}
						setSelectedDays={setSelectedDays}
						meetingType={meetingType}
						setMeetingType={setMeetingType}
					/>
				</div>
			</DialogContent>

			<DialogActions>
				<Button variant="contained" onClick={() => handleOpenChange(false)}>
					Cancel
				</Button>
				<Button
					onClick={handleEditClick}
					disabled={!hasValidInputs}
					variant="contained"
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};
