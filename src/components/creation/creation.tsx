"use client";

import { createMeeting } from "@actions/meeting/create/action";
import {
	parseAsArrayOf,
	parseAsString,
	parseAsStringEnum,
	useQueryStates,
} from "nuqs";
import { useMemo, useState } from "react";
import { Calendar } from "@/components/creation/calendar/calendar";
import { MeetingNameField } from "@/components/creation/fields/meeting-name-field";
import { MeetingTimeField } from "@/components/creation/fields/meeting-time-field";
import { Button } from "@/components/ui/button";
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
		selectedDates: parseAsArrayOf(parseAsString).withDefault([]),
		meetingType: parseAsStringEnum(["dates", "days"]).withDefault("dates"),
		timezone: parseAsString.withDefault("America/Los_Angeles"),
	});

	// Convert selected dates from ISO strings to ZotDate objects.
	const selectedDays: ZotDate[] = useMemo(() => {
		return urlState.selectedDates.map(
			(isoString) => new ZotDate(new Date(isoString)),
		);
	}, [urlState.selectedDates]);

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
		<div className="space-y-6 px-4">
			<div className="px-4 pt-8 md:pl-[60px] md:pt-8">
				<h2 className="font-montserrat text-xl font-medium text-gray-dark md:text-2xl">
					Let&apos;s plan your next meeting.
				</h2>

				<h3 className="text-sm font-light text-gray-400 md:text-base">
					Select potential dates and times for you and your team.
				</h3>
			</div>

			<div className="w-full rounded-xl border bg-white px-8 py-6 md:px-14">
				<div className="flex flex-col gap-6">
					<MeetingNameField
						meetingName={meetingName}
						setMeetingName={setMeetingName}
					/>

					<MeetingTimeField
						startTime={startTime}
						endTime={endTime}
						setStartTime={setStartTime}
						setEndTime={setEndTime}
					/>
				</div>
			</div>

			<Calendar
				selectedDays={selectedDays}
				setSelectedDays={setSelectedDays}
				meetingType={meetingType}
				setMeetingType={setMeetingType}
			/>

			<div className="sticky bottom-0 -ml-4 flex w-[100vw] flex-row items-center justify-end gap-x-4 border-t border-border bg-white p-3 md:bottom-4 md:ml-0 md:w-full md:rounded-xl md:border">
				<p className="text-sm font-bold uppercase text-slate-medium">
					{selectedDays.length} days selected
				</p>

				<Button
					className={cn(
						"sm:btn-wide w-48 rounded-lg border-none bg-green-500 font-montserrat text-xl font-medium text-gray-light hover:bg-green-500/80",
					)}
					disabled={!hasValidInputs || isCreating}
					onClick={handleCreation}
				>
					{isCreating ? "Creating..." : "Continue →"}
				</Button>
			</div>
		</div>
	);
}
