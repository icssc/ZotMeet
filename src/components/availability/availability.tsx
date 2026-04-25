"use client";

import { fetchGoogleCalendarEvents } from "@actions/availability/google/calendar/action";
import { Paper } from "@mui/material";
import { useDrag } from "@use-gesture/react";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { AvailabilityActions } from "@/components/availability/availability-actions";
import { GroupAvailability } from "@/components/availability/group-availability";
import { GroupResponses } from "@/components/availability/group-responses";
import { AvailabilityHeader } from "@/components/availability/header/availability-header";
import { InviteMembersDialog } from "@/components/availability/invite-members-dialog";
import { PersonalAvailability } from "@/components/availability/personal-availability";
import { AvailabilityNavButton } from "@/components/availability/table/availability-nav-button";
import { AvailabilityTableHeader } from "@/components/availability/table/availability-table-header";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { TimeZoneDropdown } from "@/components/availability/table/availability-timezone";
import type { SelectMeeting, SelectScheduledMeeting } from "@/db/schema";
import { useEditState } from "@/hooks/use-edit-state";
import { useIsMobile } from "@/hooks/use-mobile";
import type { UserProfile } from "@/lib/auth/user";

import {
	buildMeetingGridIsoSet,
	buildZotDateRowsForMeetingDays,
	convertTimeFromUTC,
	generateTimeBlocks,
	getTimeFromHourMinuteString,
	getTimestampFromBlockIndex,
	mergeImportedGridSlots,
} from "@/lib/availability/utils";
import { fetchStudyRooms } from "@/lib/rooms/get-rooms";
import { getBestTimeRanges } from "@/lib/rooms/utils";
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
import { useAvailabilityStore } from "@/store/useAvailabilityStore";
import { PersonalAvailabilitySidebar } from "../nav/personal-availability-sidebar";

type DeriveMode = "availabilities" | "if-needed";
// Helper function to derive initial availability data
const deriveInitialAvailability = ({
	meetingDates,
	userId,
	allAvailabilties,
	availabilityTimeBlocks,
	mode,
	timezone,
}: {
	timezone: string;
	meetingDates: string[];
	userId: string | null;
	allAvailabilties: MemberMeetingAvailability[];
	availabilityTimeBlocks: number[];
	mode: DeriveMode;
}) => {
	const getTimestamps = (member: MemberMeetingAvailability) =>
		mode === "availabilities"
			? member.meetingAvailabilities
			: member.ifNeededAvailabilities;

	const userAvailability =
		allAvailabilties.find((a) => a.memberId === userId) ?? null;

	const availabilitiesByDate = new Map<string, string[]>();
	if (userAvailability) {
		getTimestamps(userAvailability).forEach((timeStr) => {
			const dateStr = new Date(timeStr).toLocaleDateString("en-CA");
			if (!availabilitiesByDate.has(dateStr)) {
				availabilitiesByDate.set(dateStr, []);
			}
			availabilitiesByDate.get(dateStr)?.push(timeStr);
		});
	}

	const timestampsByDate = new Map<string, Map<string, string[]>>();
	for (const member of allAvailabilties) {
		for (const timestamp of getTimestamps(member)) {
			const dateStr = new Date(timestamp).toLocaleDateString("en-CA");
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

	return meetingDates
		.map((meetingDate) => {
			const dateStr = meetingDate.split("T")[0];
			const date = fromZonedTime(`${dateStr}T00:00:00`, timezone);

			const earliestMinutes = availabilityTimeBlocks[0] || 480;
			const latestMinutes =
				(availabilityTimeBlocks[availabilityTimeBlocks.length - 1] || 1035) +
				15;

			return new ZotDate(
				date,
				earliestMinutes,
				latestMinutes,
				false,
				availabilitiesByDate.get(dateStr) || [],
				Object.fromEntries(timestampsByDate.get(dateStr) || new Map()),
				timezone,
			);
		})
		.sort((a, b) => a.day.getTime() - b.day.getTime());
};
export type Availability = "available" | "if-needed" | "unavailable";
export function Availability({
	meetingData,
	allAvailabilities,
	user,
	scheduledBlocks,
	autoOpenInviteDialog = false,
	inviteQueryInUrl = false,
}: {
	meetingData: SelectMeeting;
	allAvailabilities: MemberMeetingAvailability[];
	user: UserProfile | null;
	scheduledBlocks: SelectScheduledMeeting[];
	autoOpenInviteDialog?: boolean;
	inviteQueryInUrl?: boolean;
}) {
	const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
	const [availabilitySelectionMode, setAvailabilitySelectionMode] =
		useState<Availability>("available");
	const availabilityView = useAvailabilityStore(
		(state) => state.availabilityView,
	);

	const selectionIsLocked = useAvailabilityStore(
		(state) => state.selectionIsLocked,
	);
	const resetSelection = useAvailabilityStore((state) => state.resetSelection);
	const setIsMobileDrawerOpen = useAvailabilityStore(
		(state) => state.setIsMobileDrawerOpen,
	);
	const toggleHoverGrid = useAvailabilityStore(
		(state) => state.toggleHoverGrid,
	);
	const setImportPreview = useAvailabilityStore((s) => s.setImportPreview);

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

	const {
		currentPage,
		itemsPerPage,
		isFirstPage,
		nextPage,
		prevPage,
		setItemsPerPage,
	} = useAvailabilityStore(
		useShallow((state) => ({
			currentPage: state.currentPage,
			itemsPerPage: state.itemsPerPage,
			isFirstPage: state.isFirstPage,
			nextPage: state.nextPage,
			prevPage: state.prevPage,
			setItemsPerPage: state.setItemsPerPage,
		})),
	);
	const isMobile = useIsMobile();

	useEffect(() => {
		setItemsPerPage(isMobile ? 2 : 5);
	}, [isMobile, setItemsPerPage]);

	useEffect(() => {
		if (autoOpenInviteDialog) {
			setIsInviteDialogOpen(true);
		}
	}, [autoOpenInviteDialog]);

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

	const importGridIsoSet = useMemo(
		() =>
			buildMeetingGridIsoSet(
				buildZotDateRowsForMeetingDays(
					meetingData.dates,
					availabilityTimeBlocks,
					userTimezone,
				),
				fromTimeMinutes,
				availabilityTimeBlocks.length,
				userTimezone,
			),
		[meetingData.dates, fromTimeMinutes, availabilityTimeBlocks, userTimezone],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: clear import overlay when meeting or viewer TZ changes
	useEffect(() => {
		setImportPreview(null);
	}, [meetingData.id, userTimezone, setImportPreview]);

	useEffect(() => {
		if (availabilityView !== "personal") setImportPreview(null);
	}, [availabilityView, setImportPreview]);

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
			userId: user?.memberId ?? null,
			allAvailabilties: allAvailabilities,
			availabilityTimeBlocks,
			mode: "availabilities",
		}),
	);

	const [ifNeededDates, setIfNeededDates] = useState(() =>
		deriveInitialAvailability({
			timezone: userTimezone,
			meetingDates: meetingData.dates,
			userId: user?.memberId ?? null,
			allAvailabilties: allAvailabilities,
			availabilityTimeBlocks,
			mode: "if-needed",
		}),
	);
	const bestTimeRanges = useMemo(() => {
		return getBestTimeRanges(availabilityDates);
	}, [availabilityDates]);

	const { cancelEdit, confirmSave } = useEditState({
		currentAvailabilityDates: availabilityDates,
		currentIfNeededDates: ifNeededDates,
	});

	const lastPage = Math.floor((availabilityDates.length - 1) / itemsPerPage);

	const numPaddingDates =
		availabilityDates.length % itemsPerPage === 0
			? 0
			: itemsPerPage - (availabilityDates.length % itemsPerPage);

	const datesToOffset = currentPage * itemsPerPage;

	const currentPageAvailability = useMemo(() => {
		const pageAvailability = {
			availabilities: availabilityDates.slice(
				datesToOffset,
				datesToOffset + itemsPerPage,
			),
			ifNeeded: ifNeededDates.slice(
				datesToOffset,
				datesToOffset + itemsPerPage,
			),
		};

		if (currentPage === lastPage) {
			const padding = new Array(numPaddingDates).fill(null);
			return {
				availabilities: pageAvailability.availabilities.concat(padding),
				ifNeeded: pageAvailability.ifNeeded.concat(padding),
			};
		}

		return pageAvailability;
	}, [
		availabilityDates,
		ifNeededDates,
		datesToOffset,
		itemsPerPage,
		currentPage,
		lastPage,
		numPaddingDates,
	]);

	const handleUserAvailabilityChange = useCallback(
		(updatedDates: ZotDate[]) => {
			if (availabilitySelectionMode === "available") {
				setAvailabilityDates(updatedDates);
				console.log("s");
			} else if (availabilitySelectionMode === "if-needed") {
				setIfNeededDates(updatedDates);
				console.log("dat");
			}
		},
		[availabilitySelectionMode],
	);

	const handleImportSlotsFromMeeting = useCallback(
		(slotIsoStrings: string[]) => {
			if (!user?.memberId || slotIsoStrings.length === 0) return;
			const merged = mergeImportedGridSlots(
				availabilityDates,
				slotIsoStrings,
				user.memberId,
			);
			handleUserAvailabilityChange(merged);
			setImportPreview(null);
		},
		[
			availabilityDates,
			user?.memberId,
			handleUserAvailabilityChange,
			setImportPreview,
		],
	);
	const handleCancelEditing = useCallback(() => {
		const originalDates = cancelEdit();
		setAvailabilityDates(originalDates[0]);
		setIfNeededDates(originalDates[1]);
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
			...new Set([
				...availabilityDates.flatMap((date) =>
					Object.values(date.groupAvailability).flat(),
				),
				...ifNeededDates.flatMap((date) =>
					Object.values(date.groupAvailability).flat(),
				),
			]),
		];

		const allMembers = new Map(
			allAvailabilities.map(({ memberId, displayName, profilePicture }) => [
				memberId,
				{ memberId, displayName, profilePicture },
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
	}, [allAvailabilities, availabilityDates, ifNeededDates, user]);

	const pendingMembers = useMemo(
		() =>
			allAvailabilities
				.filter((a) => a.meetingAvailabilities.length === 0)
				.map(({ memberId, displayName, profilePicture }) => ({
					memberId,
					displayName,
					profilePicture,
				})),
		[allAvailabilities],
	);

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
		const hours = Math.floor(
			currentPageAvailability["availabilities"][0].latestTime / 60,
		);
		const minutes =
			currentPageAvailability["availabilities"][0].latestTime % 60;
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
		useAvailabilityStore.getState().hydrateScheduledTimes(timestamps);
	}, [scheduledBlocks]);

	// Drag selection for group and schedule views
	const {
		startBlockSelection,
		endBlockSelection,
		setStartBlockSelection,
		setEndBlockSelection,
		setSelectionState,
	} = useAvailabilityStore(
		useShallow((state) => ({
			startBlockSelection: state.startBlockSelection,
			endBlockSelection: state.endBlockSelection,
			setStartBlockSelection: state.setStartBlockSelection,
			setEndBlockSelection: state.setEndBlockSelection,
			setSelectionState: state.setSelectionState,
		})),
	);

	const { replaceEntireSelection } = useAvailabilityStore(
		useShallow((state) => ({
			replaceEntireSelection: state.replaceEntireSelection,
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

	//currently unused as we only have console log for now
	const [_studyRooms, setStudyRooms] = useState<any[]>([]);

	useEffect(() => {
		if (!bestTimeRanges.length) {
			setStudyRooms([]);
			return;
		}

		const fetchRooms = async () => {
			try {
				// Make one API call per (date, time) pair
				const promises = bestTimeRanges.map(({ date, time }) => {
					console.log("Fetching with:", { date, time });
					return fetchStudyRooms({ date: date, timeRange: time });
				});
				const results = await Promise.all(promises);

				console.log("Fetched study rooms:", results); // console log for now
				const combined = results.flatMap((res) => res.data ?? []);

				setStudyRooms(combined);
			} catch (err) {
				console.error("Failed to fetch study rooms:", err);
			}
		};

		fetchRooms();
	}, [bestTimeRanges]);

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
				const { startBlockSelection, endBlockSelection } =
					useAvailabilityStore.getState();
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
						const day = startBlockSelection.zotDateIndex;
						const timestamps: string[] = [];
						for (
							let blockI = earlierBlockIndex;
							blockI <= laterBlockIndex;
							blockI++
						) {
							const timestamp = getTimestampFromBlockIndex(
								blockI,
								day,
								fromTimeMinutes,
								availabilityDates,
								userTimezone,
							);
							if (timestamp) timestamps.push(timestamp);
						}

						if (timestamps.length > 0) {
							replaceEntireSelection(timestamps);
						}
					} else if (availabilityView === "personal") {
						const memberId = user?.memberId;
						if (!memberId) {
							console.log("GRAVEERROR");
							return;
						}
						const ref =
							availabilitySelectionMode === "available"
								? availabilityDates
								: ifNeededDates;
						const otherRef =
							availabilitySelectionMode === "available"
								? ifNeededDates
								: availabilityDates;
						const startZotDate = ref[startBlockSelection.zotDateIndex];
						const toggleValue = !startZotDate.getBlockAvailability(
							startBlockSelection.blockIndex,
						);
						const updatedDates = ref.map((d) => d.clone());
						const updatedOtherDates = otherRef.map((d) => d.clone());

						for (
							let dateIndex = earlierDateIndex;
							dateIndex <= laterDateIndex;
							dateIndex++
						) {
							const currentDate = updatedDates[dateIndex];
							const otherDate = updatedOtherDates[dateIndex];
							currentDate.setBlockAvailabilities(
								earlierBlockIndex,
								laterBlockIndex,
								toggleValue,
							);
							if (toggleValue && otherDate) {
								// Clear the same range from the other array
								otherDate.setBlockAvailabilities(
									earlierBlockIndex,
									laterBlockIndex,
									false,
								);
							}

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
									userTimezone,
								);

								if (!currentDate.groupAvailability[timestamp]) {
									currentDate.groupAvailability[timestamp] = [];
								}

								if (toggleValue) {
									if (
										!currentDate.groupAvailability[timestamp].includes(memberId)
									) {
										currentDate.groupAvailability[timestamp].push(memberId);
									}
									if (otherDate?.groupAvailability[timestamp]) {
										otherDate.groupAvailability[timestamp] =
											otherDate.groupAvailability[timestamp].filter(
												(id) => id !== memberId,
											);
									}
								} else {
									currentDate.groupAvailability[timestamp] =
										currentDate.groupAvailability[timestamp].filter(
											(id) => id !== memberId,
										);
								}
							}
						}

						handleUserAvailabilityChange(updatedDates);
						if (availabilitySelectionMode === "available") {
							setIfNeededDates(updatedOtherDates);
						} else {
							setAvailabilityDates(updatedOtherDates);
						}
					}
				}

				setStartBlockSelection(undefined);
				setEndBlockSelection(undefined);
				setSelectionState(undefined);
			} else {
				if (blockInfo) {
					const { zotDateIndex, blockIndex } = blockInfo;
					if (availabilityView === "schedule") {
						const start = useAvailabilityStore.getState().startBlockSelection;
						if (start) {
							setEndBlockSelection({
								zotDateIndex: start.zotDateIndex,
								blockIndex,
							});
							return;
						}
					}
					setEndBlockSelection({ zotDateIndex, blockIndex });
				}
			}
		},
		{
			pointer: { touch: true, capture: true },
			filterTaps: true,
			threshold: 3,
			eventOptions: { passive: false },
		},
	);

	// TODO: Could add selection clearing with the escape key
	return (
		<div className="flex min-h-[80vh] flex-col gap-6">
			<AvailabilityHeader
				meetingData={meetingData}
				user={user}
				availabilityDates={availabilityDates}
				ifNeededDates={ifNeededDates}
				onCancel={handleCancelEditing}
				onSave={handleSuccessfulSave}
				setChangeableTimezone={setChangeableTimezone}
				setTimezone={setUserTimezone}
				availabilityEditState={availabilitySelectionMode}
				inviteQueryInUrl={inviteQueryInUrl}
			/>

			<div className="flex min-h-0 w-full min-w-0 flex-1 flex-row items-stretch justify-start">
				<Paper
					component="div"
					variant="outlined"
					className="mr-4 flex min-h-0 min-w-0 flex-1 items-start justify-between self-stretch overflow-x-auto lg:overflow-x-hidden lg:pr-14"
				>
					<div className="-mt-2 translate-x-3">
						<AvailabilityNavButton
							direction="left"
							handleClick={prevPage}
							disabled={isFirstPage}
						/>
					</div>
					<div className="flex flex-col gap-4" {...bind()}>
						<div className="shrink-0 lg:hidden">
							<AvailabilityActions
								meetingData={meetingData}
								user={user}
								availabilityDates={availabilityDates}
								ifNeededDates={ifNeededDates}
								onCancel={handleCancelEditing}
								onSave={handleSuccessfulSave}
								setChangeableTimezone={setChangeableTimezone}
								setTimezone={setUserTimezone}
								onOpenInviteDialog={() => setIsInviteDialogOpen(true)}
							/>
						</div>
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
												meetingTitle={meetingData.title}
												timeBlock={timeBlock}
												blockIndex={blockIndex}
												availabilityTimeBlocks={availabilityTimeBlocks}
												fromTime={fromTimeMinutes}
												availabilityDates={availabilityDates}
												currentPageAvailability={currentPageAvailability}
												members={members}
												onMouseLeave={handleMouseLeave}
												isScheduling={availabilityView === "schedule"}
												timeZone={userTimezone}
											/>
										) : (
											<PersonalAvailability
												timeBlock={timeBlock}
												blockIndex={blockIndex}
												fromTimeMinutes={fromTimeMinutes}
												availabilityDates={availabilityDates}
												availabilityTimeBlocks={availabilityTimeBlocks}
												currentPageAvailability={currentPageAvailability}
												googleCalendarEvents={googleCalendarEvents}
												meetingDates={meetingData.dates}
												userTimezone={userTimezone}
											/>
										)}
									</tr>
								))}
							</tbody>
						</table>

						<div className="ml-10 flex flex-row items-center justify-between gap-4 md:ml-16">
							<TimeZoneDropdown
								timeZone={userTimezone}
								changeTimeZone={setUserTimezone}
								changeableTimezone={changeableTimezone}
							/>
						</div>
					</div>

					<div className="-mt-2 -translate-x-9">
						<AvailabilityNavButton
							direction="right"
							handleClick={() => nextPage(availabilityDates.length)}
							disabled={isLastPage}
						/>
					</div>
				</Paper>

				{(availabilityView === "group" || availabilityView === "schedule") && (
					<div className="hidden w-96 min-w-0 shrink-0 flex-col items-stretch gap-3 lg:flex lg:min-h-0">
						<AvailabilityActions
							meetingData={meetingData}
							user={user}
							availabilityDates={availabilityDates}
							ifNeededDates={ifNeededDates}
							onCancel={handleCancelEditing}
							onSave={handleSuccessfulSave}
							setChangeableTimezone={setChangeableTimezone}
							setTimezone={setUserTimezone}
							onOpenInviteDialog={() => setIsInviteDialogOpen(true)}
						/>
						<Paper
							variant="outlined"
							className="flex min-h-[24rem] min-w-0 flex-1 flex-col overflow-hidden"
						>
							<GroupResponses
								availabilityDates={availabilityDates}
								fromTime={fromTimeMinutes}
								members={members}
								pendingMembers={pendingMembers}
								timezone={userTimezone}
								anchorNormalizedDate={anchorNormalizedDate}
								currentPageAvailability={currentPageAvailability}
								availabilityTimeBlocks={availabilityTimeBlocks}
								doesntNeedDay={doesntNeedDay}
							/>
						</Paper>
					</div>
				)}
				{availabilityView === "personal" && (
					<div className="hidden w-96 min-w-0 shrink-0 flex-col items-stretch gap-3 lg:flex lg:min-h-0">
						<AvailabilityActions
							meetingData={meetingData}
							user={user}
							availabilityDates={availabilityDates}
							ifNeededDates={ifNeededDates}
							onCancel={handleCancelEditing}
							onSave={handleSuccessfulSave}
							setChangeableTimezone={setChangeableTimezone}
							setTimezone={setUserTimezone}
							onOpenInviteDialog={() => setIsInviteDialogOpen(true)}
						/>
						<Paper
							variant="outlined"
							className="flex min-h-[24rem] min-w-0 flex-1 flex-col overflow-hidden"
						>
							<PersonalAvailabilitySidebar
								availability={availabilitySelectionMode}
								setAvailability={setAvailabilitySelectionMode}
								meetingId={meetingData.id}
								userTimezone={userTimezone}
								importGridIsoSet={importGridIsoSet}
								canImport={Boolean(user?.memberId)}
								onImportSlots={handleImportSlotsFromMeeting}
							/>
						</Paper>
					</div>
				)}
			</div>
			<InviteMembersDialog
				open={isInviteDialogOpen}
				onOpenChange={setIsInviteDialogOpen}
				meetingId={meetingData.id}
			/>
		</div>
	);
}
