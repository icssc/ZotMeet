"use client";

import { fetchGoogleCalendarEvents } from "@actions/availability/google/calendar/action";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { GroupAvailability } from "@/components/availability/group-availability";
import { GroupResponses } from "@/components/availability/group-responses";
import { AvailabilityHeader } from "@/components/availability/header/availability-header";
import { PersonalAvailability } from "@/components/availability/personal-availability";
import { AvailabilityNavButton } from "@/components/availability/table/availability-nav-button";
import { AvailabilityTableHeader } from "@/components/availability/table/availability-table-header";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { JaggedOutlineOverlay } from "@/components/JaggedPage";
import type { SelectMeeting } from "@/db/schema";
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
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";
import { useGroupSelectionStore } from "@/store/useGroupSelectionStore";

// Helper function to derive initial availability data
const deriveInitialAvailability = ({
	// timezone,
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
}: {
	meetingData: SelectMeeting;
	userAvailability: MemberMeetingAvailability | null;
	allAvailabilities: MemberMeetingAvailability[];
	user: UserProfile | null;
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

	const fromTimeMinutes = getTimeFromHourMinuteString(
		fromTimeLocal as HourMinuteString,
	);
	const toTimeMinutes = getTimeFromHourMinuteString(
		toTimeLocal as HourMinuteString,
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
	const tableRef = useRef<HTMLTableElement>(null);
	const [theadHeight, setTheadHeight] = useState(0);

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
		const updateTheadHeight = () => {
			if (tableRef.current) {
				const thead = tableRef.current.querySelector("thead");
				if (thead) {
					const height = thead.offsetHeight;
					setTheadHeight(height);
				}
			}
		};

		// Use requestAnimationFrame to ensure DOM is fully rendered
		requestAnimationFrame(() => {
			updateTheadHeight();
			// Also check after a small delay to catch any async rendering
			setTimeout(updateTheadHeight, 0);
		});

		window.addEventListener("resize", updateTheadHeight);
		return () => window.removeEventListener("resize", updateTheadHeight);
	}, []);

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

	return (
		<div className="space-y-6">
			<AvailabilityHeader
				meetingData={meetingData}
				user={user}
				availabilityDates={availabilityDates}
				onCancel={handleCancelEditing}
				onSave={handleSuccessfulSave}
			/>

			<div className="flex flex-row items-start justify-start align-top">
				<div className="flex h-fit items-center gap-1 overflow-x-auto font-dm-sans lg:w-full lg:pr-14">
					<AvailabilityNavButton
						direction="left"
						handleClick={prevPage}
						disabled={isFirstPage}
					/>

					<div className="jagged-table-container relative min-w-0 flex-1">
						<table ref={tableRef} className="w-full table-fixed">
							<AvailabilityTableHeader
								currentPageAvailability={currentPageAvailability}
								meetingType={meetingData.meetingType}
							/>

							<tbody
								onMouseLeave={handleMouseLeave}
								className={cn("relative", {
									"calendar-jagged-right": isFirstPage && !isLastPage,
									"calendar-jagged-left": isLastPage && !isFirstPage,
									"calendar-jagged-both": !isFirstPage && !isLastPage,
								})}
							>
								{availabilityTimeBlocks.map((timeBlock, blockIndex) => (
									<tr key={`block-${timeBlock}`}>
										<AvailabilityTimeTicks timeBlock={timeBlock} />

										{availabilityView === "group" ? (
											<GroupAvailability
												timeBlock={timeBlock}
												blockIndex={blockIndex}
												availabilityTimeBlocks={availabilityTimeBlocks}
												fromTime={fromTimeMinutes}
												availabilityDates={availabilityDates}
												currentPageAvailability={currentPageAvailability}
												members={members}
												onMouseLeave={handleMouseLeave}
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
												meetingDates={meetingData.dates}
											/>
										)}
									</tr>
								))}
							</tbody>
						</table>
						<JaggedOutlineOverlay
							isFirstPage={isFirstPage}
							isLastPage={isLastPage}
							theadHeight={theadHeight}
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
					anchorNormalizedDate={anchorNormalizedDate}
				/>
			</div>
		</div>
	);
}
