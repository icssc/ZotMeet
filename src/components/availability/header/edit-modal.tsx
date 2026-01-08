import React, { useMemo, useState } from "react";
import { Calendar } from "@/components/creation/calendar/calendar";
import { MeetingNameField } from "@/components/creation/fields/meeting-name-field";
import { MeetingTimeField } from "@/components/creation/fields/meeting-time-field";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { SelectMeeting } from "@/db/schema";
import { convertTimeFromUTC, convertTimeToUTC } from "@/lib/availability/utils";
import { HourMinuteString } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";
import { editMeeting } from "@actions/meeting/edit/action";
import { toast } from "sonner";

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

		// Convert times from user's local timezone to UTC
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

	if (!isOpen) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-6xl">
				<DialogHeader>
					<DialogTitle>Edit Meeting</DialogTitle>
				</DialogHeader>

				<DialogDescription className="flex flex-col space-y-6 px-4 pb-6">
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
				</DialogDescription>

				<DialogFooter>
					<Button onClick={() => handleOpenChange(false)} variant={"outline"}>
						Close
					</Button>
					<Button onClick={handleEditClick} disabled={!hasValidInputs}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
