"use client";

import { fetchGoogleCalendarEvents } from "@actions/availability/google/calendar/action";
import { formatInTimeZone } from "date-fns-tz";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { AvailabilityModeToggle } from "@/components/availability/availability-mode-toggle";
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
import type {
	AvailabilityEntry,
	AvailabilityType,
	MeetingAvailability,
} from "@/lib/zotdate";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";
import { useGroupSelectionStore } from "@/store/useGroupSelectionStore";
import { useScheduleSelectionStore } from "@/store/useScheduleSelectionStore";

/**
 * Backwards-compatible normalizer:
 * - Old shape: string[]
 * - New shape: { availability: string[], ifNeeded: string[] }
 */
const normalizeMeetingAvailabilities = (raw: unknown): MeetingAvailability => {
	if (Array.isArray(raw)) {
		if (raw.every((x) => typeof x === "string")) {
			return (raw as string[]).map((time) => ({
				time,
				availabilityType: "availability",
			}));
		}

		return (raw as unknown[])
			.map((x) => {
				if (!x || typeof x !== "object") {
					return null;
				}
				const obj = x as Partial<AvailabilityEntry>;

				if (typeof obj.time !== "string") {
					return null;
				}

				if (
					obj.availabilityType !== "availability" &&
					obj.availabilityType !== "ifNeeded"
				) {
					return null;
				}

				return { time: obj.time, availabilityType: obj.availabilityType };
			})
			.filter((x): x is AvailabilityEntry => x !== null);
	}

	if (raw && typeof raw === "object") {
		const obj = raw as Partial<{ availability: unknown; ifNeeded: unknown }>;

		const availability = Array.isArray(obj.availability)
			? (obj.availability.filter((x) => typeof x === "string") as string[])
			: [];

		const ifNeeded = Array.isArray(obj.ifNeeded)
			? (obj.ifNeeded.filter((x) => typeof x === "string") as string[])
			: [];

		return [
			...availability.map((time) => ({
				time,
				availabilityType: "availability" as const,
			})),
			...ifNeeded.map((time) => ({
				time,
				availabilityType: "ifNeeded" as const,
			})),
		];
	}

	return [];
};

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
	const availabilitiesByDate = new Map<string, MeetingAvailability>();

	const ensureList = (dateStr: string): MeetingAvailability => {
		let list = availabilitiesByDate.get(dateStr);
		if (!list) {
			list = [];
			availabilitiesByDate.set(dateStr, list);
		}
		return list;
	};

	// --- Personal (logged-in user) ---
	if (userAvailability?.meetingAvailabilities) {
		const entries = normalizeMeetingAvailabilities(
			userAvailability.meetingAvailabilities,
		);

		for (const entry of entries) {
			const localDate = new Date(entry.time);
			const dateStr = localDate.toLocaleDateString("en-CA"); // YYYY-MM-DD
			ensureList(dateStr).push(entry);
		}
	}

	// --- Group availability maps (hard + ifNeeded) ---
	const hardByDate = new Map<string, Map<string, string[]>>();
	const ifNeededByDate = new Map<string, Map<string, string[]>>();

	for (const member of allAvailabilties) {
		const entries = normalizeMeetingAvailabilities(
			member.meetingAvailabilities,
		);

		for (const entry of entries) {
			const timestamp = entry.time;
			const localDate = new Date(timestamp);
			const dateStr = localDate.toLocaleDateString("en-CA");

			const targetOuter =
				entry.availabilityType === "ifNeeded" ? ifNeededByDate : hardByDate;

			let dateMap = targetOuter.get(dateStr);
			if (!dateMap) {
				dateMap = new Map();
				targetOuter.set(dateStr, dateMap);
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
			const date = new Date(year, month - 1, day);

			const earliestMinutes = availabilityTimeBlocks[0] || 480;
			const latestMinutes =
				(availabilityTimeBlocks[availabilityTimeBlocks.length - 1] || 1035) +
				15;

			const dateAvailabilities = availabilitiesByDate.get(dateStr) ?? [];

			const seen = new Set<string>();
			const deduped = dateAvailabilities.filter((e) => {
				const key = `${e.time}|${e.availabilityType}`;
				if (seen.has(key)) {
					return false;
				}
				seen.add(key);
				return true;
			});

			const dateGroupAvailabilities = Object.fromEntries(
				hardByDate.get(dateStr) || new Map(),
			);

			const dateGroupIfNeededAvailabilities = Object.fromEntries(
				ifNeededByDate.get(dateStr) || new Map(),
			);

			return new ZotDate(
				date,
				earliestMinutes,
				latestMinutes,
				false,
				deduped,
				dateGroupAvailabilities,
				dateGroupIfNeededAvailabilities,
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
	const availabilityView = useAvailabilityViewStore(
		(state) => state.availabilityView,
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

	const [availabilityDates, setAvailabilityDates] = useState(() =>
		deriveInitialAvailability({
			timezone: userTimezone,
			meetingDates: meetingData.dates,
			userAvailability,
			allAvailabilties: allAvailabilities,
			availabilityTimeBlocks,
		}),
	);

	const [availabilityMode, setAvailabilityMode] =
		useState<AvailabilityType>("availability");

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
			setAvailabilityDates(updatedDates.map((d) => d.clone()));
		},
		[],
	);

	const handleCancelEditing = useCallback(() => {
		const originalDates = cancelEdit();
		setAvailabilityDates(originalDates);
	}, [cancelEdit]);

	const handleSuccessfulSave = useCallback(() => {
		confirmSave();
		requestAnimationFrame(() => {
			window.location.reload();
		});
	}, [confirmSave]);

	useEffect(() => {
		if (availabilityDates.length > 0 && anchorNormalizedDate.length > 0) {
			const firstDateISO = anchorNormalizedDate[0].toISOString();

			const lastDateObj = new Date(
				anchorNormalizedDate[anchorNormalizedDate.length - 1],
			);
			lastDateObj.setHours(23, 59, 59, 999);
			const lastDateISO = lastDateObj.toISOString();

			fetchGoogleCalendarEvents(firstDateISO, lastDateISO)
				.then((events) => {
					setGoogleCalendarEvents(events);
				})
				.catch((error) => {
					console.error("Error fetching Google Calendar events:", error);
					setGoogleCalendarEvents([]);
				});
		} else {
			setGoogleCalendarEvents([]);
		}
	}, [availabilityDates, anchorNormalizedDate]);

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
			{availabilityView !== "group" && availabilityView !== "schedule" && (
				<div className="flex items-center justify-between">
					<AvailabilityModeToggle
						value={availabilityMode}
						onChange={setAvailabilityMode}
					/>
				</div>
			)}

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
												timezone={userTimezone}
												onMouseLeave={handleMouseLeave}
												isScheduling={availabilityView === "schedule"}
												doesntNeedDay={doesntNeedDay}
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
												availabilityMode={availabilityMode}
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

				{/* <GroupResponses
					availabilityDates={availabilityDates}
					fromTime={fromTimeMinutes}
					members={members}
					timezone={userTimezone}
					anchorNormalizedDate={anchorNormalizedDate}
				/> */}
				<GroupResponses
					availabilityDates={availabilityDates}
					fromTime={fromTimeMinutes}
					members={members}
					timezone={userTimezone}
					anchorNormalizedDate={anchorNormalizedDate}
					currentPageAvailability={currentPageAvailability}
					availabilityTimeBlocks={availabilityTimeBlocks}
					doesntNeedDay={doesntNeedDay}
				/>
			</div>
		</div>
	);
}
