"use client";

import { fetchGoogleCalendarEvents } from "@actions/availability/google/calendar/action";
import { useDrag } from "@use-gesture/react";
import { formatInTimeZone } from "date-fns-tz";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import {
	GroupAvailability,
	getTimestampFromBlockIndex,
} from "@/components/availability/group-availability";
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
import { useBlockSelectionStore } from "@/store/useBlockSelectionStore";
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

	// Drag selection for group and schedule views
	const {
		startBlockSelection,
		endBlockSelection,
		setStartBlockSelection,
		setEndBlockSelection,
		setSelectionState,
	} = useBlockSelectionStore(
		useShallow((state) => ({
			startBlockSelection: state.startBlockSelection,
			endBlockSelection: state.endBlockSelection,
			setStartBlockSelection: state.setStartBlockSelection,
			setEndBlockSelection: state.setEndBlockSelection,
			setSelectionState: state.setSelectionState,
		})),
	);

	const { togglePendingTime, addPendingTimeRange, isScheduled } =
		useScheduleSelectionStore(
			useShallow((state) => ({
				togglePendingTime: state.togglePendingTime,
				addPendingTimeRange: state.addPendingTimeRange,
				isScheduled: state.isScheduled,
			})),
		);

	useEffect(() => {
		if (startBlockSelection && endBlockSelection) {
			setSelectionState({
				earlierDateIndex: Math.min(
					startBlockSelection.zotDateIndex,
					endBlockSelection.zotDateIndex,
				),
				laterDateIndex: Math.max(
					startBlockSelection.zotDateIndex,
					endBlockSelection.zotDateIndex,
				),
				earlierBlockIndex: Math.min(
					startBlockSelection.blockIndex,
					endBlockSelection.blockIndex,
				),
				laterBlockIndex: Math.max(
					startBlockSelection.blockIndex,
					endBlockSelection.blockIndex,
				),
			});
		}
	}, [startBlockSelection, endBlockSelection, setSelectionState]);

	// Helper to get block info from pointer position
	const getBlockAtPosition = useCallback((x: number, y: number) => {
		const elements = document.elementsFromPoint(x, y);
		for (const element of elements) {
			if (
				element.hasAttribute("data-date-index") &&
				element.hasAttribute("data-block-index")
			) {
				const zotDateIndex = parseInt(
					element.getAttribute("data-date-index") || "",
					10,
				);
				const blockIndex = parseInt(
					element.getAttribute("data-block-index") || "",
					10,
				);

				if (!Number.isNaN(zotDateIndex) && !Number.isNaN(blockIndex)) {
					return { zotDateIndex, blockIndex };
				}
			}
		}
		return null;
	}, []);

	// Drag gesture for overdragging across cells
	const bind = useDrag(
		({ first, last, xy: [x, y], event, cancel }) => {
			event?.preventDefault();

			const blockInfo = getBlockAtPosition(x, y);

			if (first) {
				if (!blockInfo) {
					cancel();
					return;
				}
				const { zotDateIndex, blockIndex } = blockInfo;
				setStartBlockSelection({ zotDateIndex, blockIndex });
				setEndBlockSelection({ zotDateIndex, blockIndex });
			} else if (last) {
				if (startBlockSelection && endBlockSelection) {
					const earlierDateIndex = Math.min(
						startBlockSelection.zotDateIndex,
						endBlockSelection.zotDateIndex,
					);
					const laterDateIndex = Math.max(
						startBlockSelection.zotDateIndex,
						endBlockSelection.zotDateIndex,
					);
					const earlierBlockIndex = Math.min(
						startBlockSelection.blockIndex,
						endBlockSelection.blockIndex,
					);
					const laterBlockIndex = Math.max(
						startBlockSelection.blockIndex,
						endBlockSelection.blockIndex,
					);

					if (availabilityView === "schedule") {
						const timestamps: string[] = [];
						for (
							let dateIndex = earlierDateIndex;
							dateIndex <= laterDateIndex;
							dateIndex++
						) {
							for (
								let blockI = earlierBlockIndex;
								blockI <= laterBlockIndex;
								blockI++
							) {
								const timestamp = getTimestampFromBlockIndex(
									blockI,
									dateIndex,
									fromTimeMinutes,
									availabilityDates,
								);
								if (timestamp) timestamps.push(timestamp);
							}
						}

						if (timestamps.length > 0) {
							const firstTimestamp = timestamps[0];
							const isFirstScheduled = isScheduled(firstTimestamp);

							if (isFirstScheduled) {
								timestamps.forEach((ts) => {
									if (isScheduled(ts)) togglePendingTime(ts);
								});
							} else {
								addPendingTimeRange(timestamps);
							}
						}
					} else if (availabilityView === "personal") {
						const startZotDate =
							availabilityDates[startBlockSelection.zotDateIndex];
						const toggleValue = !startZotDate.getBlockAvailability(
							startBlockSelection.blockIndex,
						);

						const updatedDates = [...availabilityDates];

						for (
							let dateIndex = earlierDateIndex;
							dateIndex <= laterDateIndex;
							dateIndex++
						) {
							const currentDate = updatedDates[dateIndex];
							currentDate.setBlockAvailabilities(
								earlierBlockIndex,
								laterBlockIndex,
								toggleValue,
							);

							// Update group availability for each block
							for (
								let blockI = earlierBlockIndex;
								blockI <= laterBlockIndex;
								blockI++
							) {
								const timestamp = getTimestampFromBlockIndex(
									blockI,
									dateIndex,
									fromTimeMinutes,
									availabilityDates,
								);

								if (!currentDate.groupAvailability[timestamp]) {
									currentDate.groupAvailability[timestamp] = [];
								}

								if (toggleValue) {
									// Add user to availability
									if (
										!currentDate.groupAvailability[timestamp].includes(
											user?.memberId ?? "",
										)
									) {
										currentDate.groupAvailability[timestamp].push(
											user?.memberId ?? "",
										);
									}
								} else {
									currentDate.groupAvailability[timestamp] =
										currentDate.groupAvailability[timestamp].filter(
											(id) => id !== (user?.memberId ?? ""),
										);
								}
							}
						}

						handleUserAvailabilityChange(updatedDates);
					}
				}

				setStartBlockSelection(undefined);
				setEndBlockSelection(undefined);
				setSelectionState(undefined);
			} else {
				if (blockInfo) {
					const { zotDateIndex, blockIndex } = blockInfo;
					setEndBlockSelection({ zotDateIndex, blockIndex });
				}
			}
		},
		{
			pointer: { touch: true, capture: true },
			filterTaps: true,
			threshold: 3,
		},
	);

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
					<div {...bind()}>
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
												availabilityDates={availabilityDates}
												availabilityTimeBlocks={availabilityTimeBlocks}
												currentPageAvailability={currentPageAvailability}
												googleCalendarEvents={googleCalendarEvents}
												meetingDates={meetingData.dates}
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
