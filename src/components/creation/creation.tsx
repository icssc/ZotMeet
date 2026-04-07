"use client";

import { createMeeting } from "@actions/meeting/create/action";
import { Button } from "@mui/material";
import {
	parseAsArrayOf,
	parseAsString,
	parseAsStringEnum,
	useQueryStates,
} from "nuqs";
import { useMemo, useState } from "react";
import { Calendar } from "@/components/creation/calendar/calendar";
//import { MeetingLocationField } from "@/components/creation/fields/meeting-location-field";
import { MeetingNameField } from "@/components/creation/fields/meeting-name-field";
import { MeetingTimeField } from "@/components/creation/fields/meeting-time-field";
import type { SelectMeeting } from "@/db/schema";
import type { UserProfile } from "@/lib/auth/user";
import { convertTimeToUTC } from "@/lib/availability/utils";
import type { HourMinuteString } from "@/lib/types/chrono";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";

export function Creation({ user }: { user: UserProfile | null }) {
	const [isCreating, setIsCreating] = useState(false);

	// Use NUQS for URL state management
	const [urlState, setUrlState] = useQueryStates({
		meetingName: parseAsString.withDefault(""),
		startTime: parseAsString.withDefault("09:00:00"),
		endTime: parseAsString.withDefault("17:00:00"),
		meetingLocation: parseAsString.withDefault(""),
		selectedDates: parseAsArrayOf(parseAsString).withDefault([]),
		meetingType: parseAsStringEnum(["dates", "days"]).withDefault("dates"),
		timezone: parseAsString.withDefault("America/Los_Angeles"),
		groupId: parseAsString.withDefault(""),
	});

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

	const meetingName = urlState.meetingName;
	const setMeetingName = (nameOrUpdater: React.SetStateAction<string>) => {
		const newName =
			typeof nameOrUpdater === "function"
				? nameOrUpdater(urlState.meetingName)
				: nameOrUpdater;
		void setUrlState({ meetingName: newName });
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

		// If user is not logged in, redirect to Google sign in.
		if (!user) {
			// Construct URL with all parameters.
			const params = new URLSearchParams();
			params.set("meetingName", meetingName);
			params.set("startTime", startTime);
			params.set("endTime", endTime);
			params.set(
				"selectedDates",
				selectedDays.map((d) => d.day.toISOString()).join(","),
			);
			params.set("meetingType", meetingType);
			params.set("timezone", urlState.timezone);

			// Update URL with all parameters, then redirect.
			const currentUrl = new URL(window.location.href);
			currentUrl.search = params.toString();
			window.history.replaceState({}, "", currentUrl.toString());

			// Redirect to auth.
			window.location.href = "/auth/login/google";
			return;
		}

		setIsCreating(true);

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

		const newMeeting = {
			title: meetingName,
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
			startTime < endTime &&
			meetingName
		);
	}, [selectedDays.length, startTime, endTime, meetingName]);

	return (
		<div className="mx-auto my-6 flex w-[calc(100%-2rem)] max-w-6xl flex-col gap-y-6 px-4 md:my-8 md:rounded-xl md:border md:border-gray-300">
			<div className="px-2 pt-2 md:pt-2 md:pl-[40px]"></div>
			<div className="w-full rounded-xl border bg-white px-4 py-6 md:px-14">
				<h2 className="hidden font-medium text-2xl text-gray-dark sm:block md:text-3xl">
					Plan your next meeting with ZotMeet
				</h2>
				<h2 className="mb-10 flex justify-center text-3xl sm:hidden">
					Create Meeting
				</h2>

				<h3 className="hidden font-light text-gray-400 text-sm sm:mb-12 sm:block md:text-sm">
					FIND THE PERFECT TIME AND PLACE FOR YOUR MEETING.
				</h3>

				<div className="flex w-full max-w-md flex-col gap-6 md:w-full md:max-w-none">
					<MeetingNameField
						meetingName={meetingName}
						setMeetingName={setMeetingName}
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
				<div className="mt-10 flex justify-center md:justify-end">
					<Button
						variant="contained"
						type="button"
						className={cn("w-full rounded-lg font-medium text-lg md:w-auto")}
						disabled={!hasValidInputs || isCreating}
						onClick={handleCreation}
					>
						{isCreating ? "Creating..." : "Create Meeting"}
					</Button>
				</div>
			</div>

			<div className="px-2 pt-2 md:pt-2 md:pl-[40px]"></div>
		</div>
	);
}
