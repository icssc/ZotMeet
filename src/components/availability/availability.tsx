"use client";

import { fetchGoogleCalendarEvents } from "@actions/availability/google/calendar/action";
import { formatInTimeZone } from "date-fns-tz";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { GroupAvailability } from "@/components/availability/group-availability";
import { GroupResponses } from "@/components/availability/group-responses";
import { AvailabilityHeader } from "@/components/availability/header/availability-header";
import { PersonalAvailability } from "@/components/availability/personal-availability";
import { AvailabilityNavButton } from "@/components/availability/table/availability-nav-button";
import { AvailabilityTableHeader } from "@/components/availability/table/availability-table-header";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { TimeZoneDropdown } from "@/components/availability/table/availability-timezone";
import type { SelectMeeting, SelectScheduledMeeting } from "@/db/schema";
import { useEditState } from "@/hooks/use-edit-state";
import type { UserProfile } from "@/lib/auth/user";
import {
	convertTimeFromUTC,
	generateTimeBlocks,
	getTimeFromHourMinuteString,
} from "@/lib/availability/utils";
import type {
	GoogleCalendarEvent,
	MemberMeetingAvailability,
} from "@/lib/types/availability";
import type { HourMinuteString } from "@/lib/types/chrono";
import {
	convertAnchorDatesToCurrentWeek,
	isAnchorDateMeeting,
} from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";
import { useGroupSelectionStore } from "@/store/useGroupSelectionStore";
import { useScheduleSelectionStore } from "@/store/useScheduleSelectionStore";

// Helper function to derive initial availability data
const deriveInitialAvailability = ({
	meetingDates,
	userAvailability,
	allAvailabilties,
	availabilityTimeBlocks,
}: {
	timezone: string;
	meetingDates: string[];
	userAvailability: MemberMeetingAvailability | null;
	allAvailabilties: MemberMeetingAvailability[];
	availabilityTimeBlocks: number[];
}) => {
	const availabilitiesByDate = new Map<string, string[]>();
	if (userAvailability?.meetingAvailabilities) {
		userAvailability.meetingAvailabilities.forEach((timeStr) => {
			// Convert UTC timestamp to local date to get the correct day
			const localDate = new Date(timeStr);
			const dateStr = localDate.toLocaleDateString("en-CA"); // YYYY-MM-DD format

			if (!availabilitiesByDate.has(dateStr)) {
				availabilitiesByDate.set(dateStr, []);
			}

			availabilitiesByDate.get(dateStr)?.push(timeStr);
		});
	}

	const timestampsByDate = new Map<string, Map<string, string[]>>();
	for (const member of allAvailabilties) {
		for (const timestamp of member.meetingAvailabilities) {
			// Convert UTC timestamp to local date to get the correct day
			const localDate = new Date(timestamp);
			const dateStr = localDate.toLocaleDateString("en-CA"); // YYYY-MM-DD format

			let dateMap = timestampsByDate.get(dateStr);
			if (dateMap === undefined) {
				dateMap = new Map();
				timestampsByDate.set(dateStr, dateMap);
			}

			if (!dateMap.has(timestamp)) {
				dateMap.set(timestamp, []);
			}
			dateMap.get(timestamp)?.push(member.memberId);
		}
	}

	const initialAvailability = meetingDates
		.map((meetingDate) => {
			// Extract the date part and create a Date object in LOCAL timezone
			const dateStr = meetingDate.split("T")[0];
			const [year, month, day] = dateStr.split("-").map(Number);
			// Create date at midnight in LOCAL timezone
			const date = new Date(year, month - 1, day);

			const earliestMinutes = availabilityTimeBlocks[0] || 480;
			const latestMinutes =
				(availabilityTimeBlocks[availabilityTimeBlocks.length - 1] || 1035) +
				15;

			const dateAvailabilities = availabilitiesByDate.get(dateStr) || [];

			const dateGroupAvailabilities = Object.fromEntries(
				timestampsByDate.get(dateStr) || new Map(),
			);
			return new ZotDate(
				date,
				earliestMinutes,
				latestMinutes,
				false,
				dateAvailabilities,
				dateGroupAvailabilities,
			);
		})
		.sort((a, b) => a.day.getTime() - b.day.getTime());

	return initialAvailability;
};

export function Availability({
	meetingData,
	userAvailability,
	allAvailabilities,
	user,
	scheduledBlocks,
}: {
	meetingData: SelectMeeting;
	userAvailability: MemberMeetingAvailability | null;
	allAvailabilities: MemberMeetingAvailability[];
	user: UserProfile | null;
	scheduledBlocks: SelectScheduledMeeting[];
}) {
	const router = useRouter();
	const availabilityView = useAvailabilityViewStore(
		(state) => state.availabilityView,
	);

	const overlayGoogleCalendar = useAvailabilityViewStore(
		(state) => state.overlayGoogleCalendar,
	);

	const selectionIsLocked = useGroupSelectionStore(
		(state) => state.selectionIsLocked,
	);
	const resetSelection = useGroupSelectionStore(
		(state) => state.resetSelection,
	);
	const setIsMobileDrawerOpen = useGroupSelectionStore(
		(state) => state.setIsMobileDrawerOpen,
	);
	const toggleHoverGrid = useGroupSelectionStore(
		(state) => state.toggleHoverGrid,
	);

	const handleMouseLeave = useCallback(() => {
		if (availabilityView === "group" && !selectionIsLocked) {
			setIsMobileDrawerOpen(false);
			resetSelection();
		}
		toggleHoverGrid(false);
	}, [
		availabilityView,
		selectionIsLocked,
		setIsMobileDrawerOpen,
		resetSelection,
		toggleHoverGrid,
	]);

	const { currentPage, itemsPerPage, isFirstPage, nextPage, prevPage } =
		useAvailabilityPaginationStore(
			useShallow((state) => ({
				currentPage: state.currentPage,
				itemsPerPage: state.itemsPerPage,
				isFirstPage: state.isFirstPage,
				nextPage: state.nextPage,
				prevPage: state.prevPage,
			})),
		);
	const isLastPage =
		currentPage === Math.floor((meetingData.dates.length - 1) / itemsPerPage);

	// Convert UTC times to user's local timezone for display

	const [userTimezone, setUserTimezone] = useState(
		Intl.DateTimeFormat().resolvedOptions().timeZone,
	);
	const [changeableTimezone, setChangeableTimezone] = useState(true);
	const referenceDate = meetingData.dates[0];

	const fromTimeLocal = useMemo(
		() => convertTimeFromUTC(meetingData.fromTime, userTimezone, referenceDate),
		[meetingData.fromTime, userTimezone, referenceDate],
	);
	const toTimeLocal = useMemo(
		() => convertTimeFromUTC(meetingData.toTime, userTimezone, referenceDate),
		[meetingData.toTime, userTimezone, referenceDate],
	);

	const fromTimeMinutes = useMemo(
		() => getTimeFromHourMinuteString(fromTimeLocal as HourMinuteString),
		[fromTimeLocal],
	);
	const toTimeMinutes = useMemo(
		() => getTimeFromHourMinuteString(toTimeLocal as HourMinuteString),
		[toTimeLocal],
	);
	const availabilityTimeBlocks = useMemo(
		() => generateTimeBlocks(fromTimeMinutes, toTimeMinutes),
		[fromTimeMinutes, toTimeMinutes],
	);

	const anchorNormalizedDate = useMemo(() => {
		return isAnchorDateMeeting(meetingData.dates)
			? convertAnchorDatesToCurrentWeek(meetingData.dates).map(
					(dateStr) => new Date(dateStr),
				)
			: meetingData.dates.map((dateStr) => new Date(dateStr));
	}, [meetingData.dates]);

	const [googleCalendarEvents, setGoogleCalendarEvents] = useState<
		GoogleCalendarEvent[]
	>([]);
	// const [hasFetchedCalendar, setHasFetchedCalendar] = useState(false);

	const [availabilityDates, setAvailabilityDates] = useState(() =>
		deriveInitialAvailability({
			timezone: userTimezone,
			meetingDates: meetingData.dates,
			userAvailability,
			allAvailabilties: allAvailabilities,
			availabilityTimeBlocks,
		}),
	);

	const { cancelEdit, confirmSave } = useEditState({
		currentAvailabilityDates: availabilityDates,
	});

	const lastPage = Math.floor((availabilityDates.length - 1) / itemsPerPage);

	const numPaddingDates =
		availabilityDates.length % itemsPerPage === 0
			? 0
			: itemsPerPage - (availabilityDates.length % itemsPerPage);

	const datesToOffset = currentPage * itemsPerPage;

	const currentPageAvailability = useMemo(() => {
		let pageAvailability = availabilityDates.slice(
			datesToOffset,
			datesToOffset + itemsPerPage,
		);

		if (currentPage === lastPage) {
			pageAvailability = pageAvailability.concat(
				new Array(numPaddingDates).fill(null),
			);
		}

		return pageAvailability;
	}, [
		availabilityDates,
		datesToOffset,
		itemsPerPage,
		currentPage,
		lastPage,
		numPaddingDates,
	]);

	const handleUserAvailabilityChange = useCallback(
		(updatedDates: ZotDate[]) => {
			setAvailabilityDates(updatedDates);
		},
		[],
	);
	const handleCancelEditing = useCallback(() => {
		const originalDates = cancelEdit();
		setAvailabilityDates(originalDates);
	}, [cancelEdit]);

	const handleSuccessfulSave = useCallback(() => {
		confirmSave();
	}, [confirmSave]);

	useEffect(() => {
		if (!overlayGoogleCalendar) {
			return;
		}
		// if (hasFetchedCalendar) return;

		if (availabilityDates.length === 0 || anchorNormalizedDate.length === 0)
			return;

		const firstDateISO = anchorNormalizedDate[0].toISOString();
		const lastDateObj = new Date(
			anchorNormalizedDate[anchorNormalizedDate.length - 1],
		);
		lastDateObj.setHours(23, 59, 59, 999);

		fetchGoogleCalendarEvents(firstDateISO, lastDateObj.toISOString()).then(
			(result) => {
				if (
					result.status === "missing_scope" ||
					result.status === "not_authenticated"
				) {
					router.push("/auth/login/google/?prompt=consent");

					return;
				}
				setGoogleCalendarEvents(result.events);
				// setHasFetchedCalendar(true);
			},
		);
	}, [
		overlayGoogleCalendar,
		availabilityDates,
		anchorNormalizedDate,
		// hasFetchedCalendar,
		router,
	]);

	const members = useMemo(() => {
		const presentMemberIds = [
			...new Set(
				availabilityDates.flatMap((date) =>
					Object.values(date.groupAvailability).flat(),
				),
			),
		];

		const allMembers = new Map(
			allAvailabilities.map(({ memberId, displayName }) => [
				memberId,
				{ memberId, displayName },
			]),
		);

		if (
			user &&
			presentMemberIds.includes(user.memberId) &&
			!allMembers.has(user.memberId)
		) {
			allMembers.set(user.memberId, user);
		}

		return Array.from(allMembers.values());
	}, [allAvailabilities, availabilityDates, user]);

	let doesntNeedDay = true;
	let past = availabilityTimeBlocks[0];
	availabilityTimeBlocks.forEach((minutes, index) => {
		if (
			index !== 0 &&
			minutes - past !== 15 &&
			index !== availabilityTimeBlocks.length - 1
		) {
			doesntNeedDay = false;
		}
		past = availabilityTimeBlocks[index];
	});

	const lastUTCDateTime = useMemo(() => {
		const day = new Date(availabilityDates[availabilityDates.length - 1].day);
		const hours = Math.floor(currentPageAvailability[0].latestTime / 60);
		const minutes = currentPageAvailability[0].latestTime % 60;
		day.setHours(hours, minutes, 0, 0);
		return day;
	}, [availabilityDates, currentPageAvailability]);

	const utcDay = formatInTimeZone(
		lastUTCDateTime,
		Intl.DateTimeFormat().resolvedOptions().timeZone,
		"yyyy-MM-dd",
	);

	const userDay = formatInTimeZone(lastUTCDateTime, userTimezone, "yyyy-MM-dd");
	const userHour = Number(formatInTimeZone(lastUTCDateTime, userTimezone, "H"));
	if (utcDay !== userDay && userHour !== 0) {
		doesntNeedDay = false;
	}

	useEffect(() => {
		const timestamps: string[] = [];

		for (const block of scheduledBlocks) {
			const date = new Date(block.scheduledDate);
			const [h, m, s] = block.scheduledFromTime.split(":").map(Number);

			date.setHours(h, m, s, 0);

			timestamps.push(date.toISOString());
		}

		// add DB timestamps to the state
		useScheduleSelectionStore.getState().hydrateScheduledTimes(timestamps);
	}, [scheduledBlocks]);

	// TODO: Could add selection clearing with the escape key
	return (
		<div className="space-y-6">
			<AvailabilityHeader
				meetingData={meetingData}
				user={user}
				availabilityDates={availabilityDates}
				onCancel={handleCancelEditing}
				onSave={handleSuccessfulSave}
				setChangeableTimezone={setChangeableTimezone}
				setTimezone={setUserTimezone}
			/>

			<div className="flex flex-row items-start justify-start align-top">
				<div className="flex h-fit items-center justify-between overflow-x-auto font-dm-sans lg:w-full lg:pr-14">
					<AvailabilityNavButton
						direction="left"
						handleClick={prevPage}
						disabled={isFirstPage}
					/>
					<div>
						<table className="w-full table-fixed">
							<AvailabilityTableHeader
								currentPageAvailability={currentPageAvailability}
								meetingType={meetingData.meetingType}
								doesntNeedDay={doesntNeedDay}
							/>
							<tbody onMouseLeave={handleMouseLeave}>
								{availabilityTimeBlocks.map((timeBlock, blockIndex) => (
									<tr key={`block-${timeBlock}`}>
										<AvailabilityTimeTicks timeBlock={timeBlock} />

										{availabilityView === "group" ||
										availabilityView === "schedule" ? (
											<GroupAvailability
												meetingId={meetingData.id}
												timeBlock={timeBlock}
												blockIndex={blockIndex}
												availabilityTimeBlocks={availabilityTimeBlocks}
												fromTime={fromTimeMinutes}
												availabilityDates={availabilityDates}
												currentPageAvailability={currentPageAvailability}
												members={members}
												onMouseLeave={handleMouseLeave}
												isScheduling={availabilityView === "schedule"}
											/>
										) : (
											<PersonalAvailability
												timeBlock={timeBlock}
												blockIndex={blockIndex}
												availabilityTimeBlocks={availabilityTimeBlocks}
												fromTime={fromTimeMinutes}
												availabilityDates={availabilityDates}
												currentPageAvailability={currentPageAvailability}
												googleCalendarEvents={googleCalendarEvents}
												user={user}
												onAvailabilityChange={handleUserAvailabilityChange}
												timezone={userTimezone}
												meetingDates={meetingData.dates}
												showGoogleCalendar={overlayGoogleCalendar}
											/>
										)}
									</tr>
								))}
							</tbody>
						</table>
						<TimeZoneDropdown
							timeZone={userTimezone}
							changeTimeZone={setUserTimezone}
							changeableTimezone={changeableTimezone}
						/>
					</div>
					<AvailabilityNavButton
						direction="right"
						handleClick={() => nextPage(availabilityDates.length)}
						disabled={isLastPage}
					/>
				</div>

				<GroupResponses
					availabilityDates={availabilityDates}
					fromTime={fromTimeMinutes}
					members={members}
					// timezone={userTimezone}
					anchorNormalizedDate={anchorNormalizedDate}
					currentPageAvailability={currentPageAvailability}
					availabilityTimeBlocks={availabilityTimeBlocks}
					doesntNeedDay={doesntNeedDay}
				/>
			</div>
		</div>
	);
}
