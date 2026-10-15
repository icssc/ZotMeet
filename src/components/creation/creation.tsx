"use client";

import { createMeeting } from "@actions/meeting/create/action";
import { Button, DialogActions, DialogContent } from "@mui/material";
import {
	parseAsArrayOf,
	parseAsBoolean,
	parseAsString,
	parseAsStringEnum,
	useQueryStates,
} from "nuqs";
import { useMemo, useRef, useState } from "react";
import { Calendar } from "@/components/creation/calendar/calendar";
//import { MeetingLocationField } from "@/components/creation/fields/meeting-location-field";
import { MeetingNameField } from "@/components/creation/fields/meeting-name-field";
import { MeetingTimeField } from "@/components/creation/fields/meeting-time-field";
import type { SelectMeeting } from "@/db/schema";
import type { UserProfile } from "@/lib/auth/user";
import {
	convertTimeToUTC,
	isValidStartEndTimes,
	sortMeetingIsoDatesAsc,
} from "@/lib/availability/utils";
import type { HourMinuteString } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";

/**
 * The creation form's URL state. `create` opens the dialog (links elsewhere
 * point at `/?create=true`, optionally with `groupId`); closing it clears
 * every key so a cancelled draft doesn't linger in the URL.
 */
export const creationSearchParams = {
	create: parseAsBoolean.withDefault(false),
	meetingName: parseAsString.withDefault(""),
	startTime: parseAsString.withDefault("09:00:00"),
	endTime: parseAsString.withDefault("17:00:00"),
	meetingLocation: parseAsString.withDefault(""),
	selectedDates: parseAsArrayOf(parseAsString).withDefault([]),
	meetingType: parseAsStringEnum(["dates", "days"]).withDefault("dates"),
	timezone: parseAsString.withDefault("America/Los_Angeles"),
	groupId: parseAsString.withDefault(""),
};

/** The meeting form, rendered as the body and actions of `CreateMeetingDialog`. */
export function Creation({ user }: { user: UserProfile }) {
	const [isCreating, setIsCreating] = useState(false);

	// Use NUQS for URL state management
	const [urlState, setUrlState] = useQueryStates(creationSearchParams);

	// Convert selected dates from ISO strings to ZotDate objects.
	const selectedDays: ZotDate[] = useMemo(() => {
		return urlState.selectedDates.map(
			(isoString) => new ZotDate(new Date(isoString)),
		);
	}, [urlState.selectedDates]);
	const [recommendation, setRecommendation] = useState<boolean>(false);

	// Helper to update selected days.
	const setSelectedDays = (daysOrUpdater: React.SetStateAction<ZotDate[]>) => {
		const newDays =
			typeof daysOrUpdater === "function"
				? daysOrUpdater(selectedDays)
				: daysOrUpdater;
		void setUrlState({
			selectedDates: newDays.map((d) => d.day.toISOString()),
		});
	};

	const meetingNameRef = useRef(urlState.meetingName);
	const [hasMeetingName, setHasMeetingName] = useState(!!urlState.meetingName);
	const flushMeetingName = (value: string) => {
		meetingNameRef.current = value;
		setHasMeetingName(!!value);
		void setUrlState({ meetingName: value });
	};

	const meetingLocation = urlState.meetingLocation;
	const setMeetingLocation = (locOrUpdater: React.SetStateAction<string>) => {
		const newLoc =
			typeof locOrUpdater === "function"
				? locOrUpdater(urlState.meetingLocation)
				: locOrUpdater;
		void setUrlState({ meetingLocation: newLoc });
	};

	const startTime = urlState.startTime as HourMinuteString;
	const setStartTime = (
		timeOrUpdater: React.SetStateAction<HourMinuteString>,
	) => {
		const newTime =
			typeof timeOrUpdater === "function"
				? timeOrUpdater(urlState.startTime as HourMinuteString)
				: timeOrUpdater;
		void setUrlState({ startTime: newTime });
	};

	const endTime = urlState.endTime as HourMinuteString;
	const setEndTime = (
		timeOrUpdater: React.SetStateAction<HourMinuteString>,
	) => {
		const newTime =
			typeof timeOrUpdater === "function"
				? timeOrUpdater(urlState.endTime as HourMinuteString)
				: timeOrUpdater;
		void setUrlState({ endTime: newTime });
	};

	const meetingType = urlState.meetingType as SelectMeeting["meetingType"];
	const setMeetingType = (
		typeOrUpdater: React.SetStateAction<SelectMeeting["meetingType"]>,
	) => {
		const newType =
			typeof typeOrUpdater === "function"
				? typeOrUpdater(urlState.meetingType as SelectMeeting["meetingType"])
				: typeOrUpdater;
		void setUrlState({ meetingType: newType });
	};

	const handleCreation = async () => {
		if (isCreating) return;

		setIsCreating(true);

		const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const dates = sortMeetingIsoDatesAsc(
			selectedDays.map((zotDate) => zotDate.day.toISOString()),
		);

		// Convert times from user's local timezone to UTC
		const referenceDate = dates[0];
		const fromTimeUTC = convertTimeToUTC(
			startTime,
			userTimezone,
			referenceDate,
		);
		const toTimeUTC = convertTimeToUTC(endTime, userTimezone, referenceDate);

		const newMeeting = {
			title: meetingNameRef.current,
			fromTime: fromTimeUTC,
			toTime: toTimeUTC,
			hostId: user.memberId,
			timezone: userTimezone,
			dates,
			description: "",
			meetingType,
			group_id: urlState.groupId || undefined,
		};

		const result = await createMeeting(newMeeting);

		if (result?.error) {
			console.error("Failed to create meeting: ", result.error);
			setIsCreating(false);
		}
	};

	const hasValidInputs = useMemo(() => {
		return (
			selectedDays.length > 0 &&
			startTime &&
			endTime &&
			isValidStartEndTimes(startTime, endTime) &&
			hasMeetingName
		);
	}, [selectedDays.length, startTime, endTime, hasMeetingName]);

	return (
		<>
			<DialogContent>
				<div className="flex w-full flex-col gap-6 pt-1">
					<MeetingNameField
						initialValue={urlState.meetingName}
						onBlur={flushMeetingName}
					/>
					<div className="flex flex-col md:grid md:grid-cols-2 md:gap-8">
						<div className="mb-4 flex flex-col gap-y-12">
							<MeetingTimeField
								startTime={startTime}
								endTime={endTime}
								setStartTime={setStartTime}
								setEndTime={setEndTime}
							/>
							{/*
							<MeetingLocationField
								meetingLocation={meetingLocation}
								setMeetingLocation={setMeetingLocation}
								recommendation={recommendation}
								setRecommendation={setRecommendation}
							/>
							*/}
						</div>
						<Calendar
							selectedDays={selectedDays}
							setSelectedDays={setSelectedDays}
							meetingType={meetingType}
							setMeetingType={setMeetingType}
						/>
					</div>
				</div>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 3 }}>
				<Button
					variant="contained"
					type="button"
					sx={{ width: { xs: "100%", md: "auto" } }}
					disabled={!hasValidInputs || isCreating}
					onClick={handleCreation}
				>
					{isCreating ? "Creating..." : "Create Meeting"}
				</Button>
			</DialogActions>
		</>
	);
}
