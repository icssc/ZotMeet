"use client";

import { createMeeting } from "@actions/meeting/create/action";
import SearchIcon from "@mui/icons-material/Search";
import { Input } from "@mui/material";
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
import {
	filterMeetingsByQuery,
	toMeetingCardProps,
} from "@/lib/meeting-card/mapper";
import type { HourMinuteString } from "@/lib/types/chrono";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import MeetingCard from "../ui/meeting-card";

interface CreationProps {
	user: UserProfile | null;
	meetings: (SelectMeeting & { hostDisplayName: string | null })[];
	meetingCounts: Record<string, number>;
}

export function Creation({ user, meetings, meetingCounts }: CreationProps) {
	const [isCreating, setIsCreating] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// Use NUQS for URL state management
	const [urlState, setUrlState] = useQueryStates({
		meetingName: parseAsString.withDefault(""),
		startTime: parseAsString.withDefault("09:00:00"),
		endTime: parseAsString.withDefault("17:00:00"),
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

	const filteredMeetings = useMemo(
		() => filterMeetingsByQuery(meetings, searchQuery),
		[meetings, searchQuery],
	);

	return (
		<div className="flex flex-col gap-y-6 px-4">
			<div className="px-4 pt-8 md:pt-8 md:pl-[60px]">
				<h2 className="font-medium font-montserrat text-gray-dark text-xl md:text-2xl">
					Let&apos;s plan your next meeting.
				</h2>

				<h3 className="font-light text-gray-400 text-sm md:text-base">
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

			<div className="sticky bottom-0 z-10 -mx-4 mt-4 flex flex-row items-center justify-between gap-x-4 border-border border-t bg-white p-4 py-2 md:bottom-4 md:mx-0 md:rounded-xl md:border">
				<p className="font-bold text-slate-medium text-sm uppercase">
					{selectedDays.length} {selectedDays.length === 1 ? "day" : "days"}{" "}
					selected
				</p>

				<Button
					className={cn(
						"rounded-lg border-none bg-green-500 font-medium font-montserrat text-gray-light text-lg hover:bg-green-500/80",
					)}
					disabled={!hasValidInputs || isCreating}
					onClick={handleCreation}
				>
					{isCreating ? "Creating..." : "Continue →"}
				</Button>
			</div>

			<div className="flex w-full items-center gap-3">
				<div className="group relative w-full max-w-2xl">
					<SearchIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400 transition-opacity group-focus-within:opacity-0" />

					<Input
						disableUnderline
						placeholder="Search Meetings"
						className="w-full rounded-3xl border-2 border-gray-300 p-3 pl-11 transition-all group-focus-within:pl-3"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			{filteredMeetings.length === 0 ? (
				<div className="flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-[#F9FAFB] bg-opacity-50 p-6 pr-8">
					<h3 className="truncate font-dm-sans font-medium text-gray-800 text-xl">
						{searchQuery.trim()
							? "No meetings match your search."
							: "You have no meetings yet."}
					</h3>
				</div>
			) : (
				<div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-3">
					{filteredMeetings.map((meeting) => {
						const cardProps = toMeetingCardProps(meeting, {
							responderCount: meetingCounts[meeting.id] ?? 0,
						});

						return <MeetingCard key={meeting.id} {...cardProps} />;
					})}
				</div>
			)}
		</div>
	);
}
