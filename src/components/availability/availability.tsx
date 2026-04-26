"use client";

import { fetchGoogleCalendarEvents } from "@actions/availability/google/calendar/action";
import { Paper } from "@mui/material";
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
import {
	type GridCell,
	useGridDragSelection,
} from "@/hooks/use-grid-drag-selection";
import { useIsMobile } from "@/hooks/use-mobile";
import type { UserProfile } from "@/lib/auth/user";
import { paintPersonalSelection } from "@/lib/availability/paint-selection";
import { applyScheduleSelection } from "@/lib/availability/schedule-selection";

import {
	buildMeetingGridIsoSet,
	buildZotDateRowsForMeetingDays,
	convertTimeFromUTC,
	generateTimeBlocks,
	getTimeFromHourMinuteString,
	mergeImportedGridSlots,
} from "@/lib/availability/utils";
import type {
	GoogleCalendarEvent,
	MemberMeetingAvailability,
	SelectionStateType,
} from "@/lib/types/availability";
import type { HourMinuteString } from "@/lib/types/chrono";
import {
	convertAnchorDatesToCurrentWeek,
	isAnchorDateMeeting,
} from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";
import { PersonalAvailabilitySidebar } from "../nav/personal-availability-sidebar";

function rangesEqual(
	a: SelectionStateType | undefined,
	b: SelectionStateType | undefined,
): boolean {
	if (!a || !b) return false;
	return (
		a.earlierDateIndex === b.earlierDateIndex &&
		a.laterDateIndex === b.laterDateIndex &&
		a.earlierBlockIndex === b.earlierBlockIndex &&
		a.laterBlockIndex === b.laterBlockIndex
	);
}

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
	const availabilityView = useAvailabilityStore(
		(state) => state.availabilityView,
	);
	const paintMode = useAvailabilityStore((state) => state.paintMode);

	const committedRange = useAvailabilityStore((state) => state.committedRange);
	const resetSelection = useAvailabilityStore((state) => state.resetSelection);
	const setIsMobileDrawerOpen = useAvailabilityStore(
		(state) => state.setIsMobileDrawerOpen,
	);
	const toggleHoverGrid = useAvailabilityStore(
		(state) => state.toggleHoverGrid,
	);
	const setHoverRange = useAvailabilityStore((state) => state.setHoverRange);
	const setDraftRange = useAvailabilityStore((state) => state.setDraftRange);
	const setCommittedRange = useAvailabilityStore(
		(state) => state.setCommittedRange,
	);
	const setImportPreview = useAvailabilityStore((s) => s.setImportPreview);

	const groupSelectionIsLocked =
		availabilityView === "group" && committedRange !== undefined;

	const handleMouseLeave = useCallback(() => {
		if (availabilityView === "group" && !groupSelectionIsLocked) {
			setIsMobileDrawerOpen(false);
			resetSelection();
		}
		setHoverRange(undefined);
		toggleHoverGrid(false);
	}, [
		availabilityView,
		groupSelectionIsLocked,
		setIsMobileDrawerOpen,
		resetSelection,
		setHoverRange,
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
			if (paintMode === "available") {
				setAvailabilityDates(updatedDates);
			} else if (paintMode === "if-needed") {
				setIfNeededDates(updatedDates);
			}
		},
		[paintMode],
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

	const handleClearAvailability = useCallback(() => {
		const memberId = user?.memberId;
		if (!memberId) return;
		if (availabilityDates.length === 0 || availabilityTimeBlocks.length === 0) {
			return;
		}
		const next = paintPersonalSelection({
			availabilityDates,
			ifNeededDates,
			mode: "unavailable",
			range: {
				earlierDateIndex: 0,
				laterDateIndex: availabilityDates.length - 1,
				earlierBlockIndex: 0,
				laterBlockIndex: availabilityTimeBlocks.length - 1,
			},
			memberId,
			fromTimeMinutes,
			timeZone: userTimezone,
		});
		setAvailabilityDates(next.availabilityDates);
		setIfNeededDates(next.ifNeededDates);
		setCommittedRange(undefined);
		setDraftRange(undefined);
		setHoverRange(undefined);
	}, [
		user?.memberId,
		availabilityDates,
		ifNeededDates,
		availabilityTimeBlocks.length,
		fromTimeMinutes,
		userTimezone,
		setCommittedRange,
		setDraftRange,
		setHoverRange,
	]);

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

	const replaceEntireSelection = useAvailabilityStore(
		(state) => state.replaceEntireSelection,
	);

	const handleCommit = useCallback<
		(
			range: SelectionStateType,
			ctx: { isTap: boolean; start: GridCell; end: GridCell },
		) => void
	>(
		(range, { isTap }) => {
			setDraftRange(undefined);

			if (availabilityView === "personal") {
				const memberId = user?.memberId;
				if (!memberId) return;
				const next = paintPersonalSelection({
					availabilityDates,
					ifNeededDates,
					mode: paintMode,
					range,
					memberId,
					fromTimeMinutes,
					timeZone: userTimezone,
				});
				setAvailabilityDates(next.availabilityDates);
				setIfNeededDates(next.ifNeededDates);
				setCommittedRange(range);
				return;
			}

			if (availabilityView === "schedule") {
				const timestamps = applyScheduleSelection({
					availabilityDates,
					range,
					fromTimeMinutes,
					timeZone: userTimezone,
				});
				if (timestamps.length > 0) {
					replaceEntireSelection(timestamps);
				}
				setCommittedRange(range);
				return;
			}

			const state = useAvailabilityStore.getState();
			const existing = state.committedRange;
			if (isTap && existing && rangesEqual(existing, range)) {
				setCommittedRange(undefined);
				setIsMobileDrawerOpen(false);
				return;
			}
			setCommittedRange(range);
			setIsMobileDrawerOpen(true);
			toggleHoverGrid(true);
		},
		[
			availabilityView,
			paintMode,
			availabilityDates,
			ifNeededDates,
			user?.memberId,
			fromTimeMinutes,
			userTimezone,
			replaceEntireSelection,
			setDraftRange,
			setCommittedRange,
			setIsMobileDrawerOpen,
			toggleHoverGrid,
		],
	);

	const handlers = useGridDragSelection({
		lockToStartRow: availabilityView === "schedule",
		onDragStart: () => {
			setCommittedRange(undefined);
			setHoverRange(undefined);
		},
		onDragUpdate: (range) => setDraftRange(range),
		onCommit: handleCommit,
		onCancel: () => setDraftRange(undefined),
	});

	const handleCellHover = useCallback(
		(cell: GridCell) => {
			toggleHoverGrid(true);
			if (availabilityView !== "group") return;
			if (groupSelectionIsLocked) return;
			setHoverRange({
				earlierDateIndex: cell.zotDateIndex,
				laterDateIndex: cell.zotDateIndex,
				earlierBlockIndex: cell.blockIndex,
				laterBlockIndex: cell.blockIndex,
			});
		},
		[availabilityView, groupSelectionIsLocked, setHoverRange, toggleHoverGrid],
	);

	const gridHandlers = useMemo(
		() => ({ ...handlers, onCellHover: handleCellHover }),
		[handlers, handleCellHover],
	);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key !== "Escape") return;
			resetSelection();
			setDraftRange(undefined);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [resetSelection, setDraftRange]);

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
					<div className="flex flex-col gap-4">
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
												handlers={gridHandlers}
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
												handlers={handlers}
												paintMode={paintMode}
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
								meetingId={meetingData.id}
								userTimezone={userTimezone}
								importGridIsoSet={importGridIsoSet}
								canImport={Boolean(user?.memberId)}
								onImportSlots={handleImportSlotsFromMeeting}
								onClearAvailability={handleClearAvailability}
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
