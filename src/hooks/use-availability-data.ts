"use client";

import { fetchGoogleCalendarEvents } from "@actions/availability/google/calendar/action";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { useEffect, useMemo, useState } from "react";
import type { SelectMeeting, SelectScheduledMeeting } from "@/db/schema";
import { useEditState } from "@/hooks/use-edit-state";
import type { UserProfile } from "@/lib/auth/user";
import {
	buildMeetingGridIsoSet,
	buildZotDateRowsForMeetingDays,
} from "@/lib/availability/utils";
import type {
	GoogleCalendarEvent,
	Member,
	MemberMeetingAvailability,
} from "@/lib/types/availability";
import {
	convertAnchorDatesToCurrentWeek,
	isAnchorDateMeeting,
} from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

type DeriveMode = "availabilities" | "if-needed";

/**
 * Initialises a `ZotDate[]` grid from the server-side availability data for
 * either the "available" or "if-needed" dimension. Pulled out of the hook so
 * `useState` initialisers can call it lazily without closing over stale args.
 */
function deriveInitialAvailability(args: {
	timezone: string;
	meetingDates: string[];
	userId: string | null;
	allAvailabilties: MemberMeetingAvailability[];
	availabilityTimeBlocks: number[];
	mode: DeriveMode;
}): ZotDate[] {
	const {
		meetingDates,
		userId,
		allAvailabilties,
		availabilityTimeBlocks,
		mode,
		timezone,
	} = args;

	const getTimestamps = (member: MemberMeetingAvailability) =>
		mode === "availabilities"
			? member.meetingAvailabilities
			: member.ifNeededAvailabilities;

	const userAvailability =
		allAvailabilties.find((a) => a.memberId === userId) ?? null;

	const availabilitiesByDate = new Map<string, string[]>();
	if (userAvailability) {
		getTimestamps(userAvailability).forEach((timeStr) => {
			const dateStr = formatInTimeZone(
				new Date(timeStr),
				timezone,
				"yyyy-MM-dd",
			);
			if (!availabilitiesByDate.has(dateStr)) {
				availabilitiesByDate.set(dateStr, []);
			}
			availabilitiesByDate.get(dateStr)?.push(timeStr);
		});
	}

	const timestampsByDate = new Map<string, Map<string, string[]>>();
	for (const member of allAvailabilties) {
		for (const timestamp of getTimestamps(member)) {
			const dateStr = formatInTimeZone(
				new Date(timestamp),
				timezone,
				"yyyy-MM-dd",
			);
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
}

interface UseAvailabilityDataArgs {
	meetingData: SelectMeeting;
	allAvailabilities: MemberMeetingAvailability[];
	user: UserProfile | null;
	scheduledBlocks: SelectScheduledMeeting[];
	userTimezone: string;
	fromTimeMinutes: number;
	availabilityTimeBlocks: number[];
	currentPage: number;
	itemsPerPage: number;
}

export interface UseAvailabilityDataResult {
	availabilityDates: ZotDate[];
	setAvailabilityDates: React.Dispatch<React.SetStateAction<ZotDate[]>>;
	ifNeededDates: ZotDate[];
	setIfNeededDates: React.Dispatch<React.SetStateAction<ZotDate[]>>;
	googleCalendarEvents: GoogleCalendarEvent[];
	members: Member[];
	pendingMembers: Member[];
	anchorNormalizedDate: Date[];
	importGridIsoSet: ReadonlySet<string>;
	doesntNeedDay: boolean;
	currentPageAvailability: {
		availabilities: (ZotDate | null)[];
		ifNeeded: (ZotDate | null)[];
	};
	cancelEdit: () => { availabilityDates: ZotDate[]; ifNeededDates: ZotDate[] };
	confirmSave: () => void;
	isDirty: boolean;
}

export function useAvailabilityData({
	meetingData,
	allAvailabilities,
	user,
	scheduledBlocks,
	userTimezone,
	fromTimeMinutes,
	availabilityTimeBlocks,
	currentPage,
	itemsPerPage,
}: UseAvailabilityDataArgs): UseAvailabilityDataResult {
	const [availabilityDates, setAvailabilityDates] = useState<ZotDate[]>(() =>
		deriveInitialAvailability({
			timezone: userTimezone,
			meetingDates: meetingData.dates,
			userId: user?.memberId ?? null,
			allAvailabilties: allAvailabilities,
			availabilityTimeBlocks,
			mode: "availabilities",
		}),
	);

	const [ifNeededDates, setIfNeededDates] = useState<ZotDate[]>(() =>
		deriveInitialAvailability({
			timezone: userTimezone,
			meetingDates: meetingData.dates,
			userId: user?.memberId ?? null,
			allAvailabilties: allAvailabilities,
			availabilityTimeBlocks,
			mode: "if-needed",
		}),
	);

	const { cancelEdit, confirmSave, isDirty } = useEditState({
		currentAvailabilityDates: availabilityDates,
		currentIfNeededDates: ifNeededDates,
	});

	const anchorNormalizedDate = useMemo(() => {
		return isAnchorDateMeeting(meetingData.dates)
			? convertAnchorDatesToCurrentWeek(meetingData.dates).map(
					(dateStr) => new Date(dateStr),
				)
			: meetingData.dates.map((dateStr) => new Date(dateStr));
	}, [meetingData.dates]);

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

	const [googleCalendarEvents, setGoogleCalendarEvents] = useState<
		GoogleCalendarEvent[]
	>([]);
	useEffect(() => {
		if (anchorNormalizedDate.length === 0) {
			setGoogleCalendarEvents([]);
			return;
		}
		const firstDateISO = anchorNormalizedDate[0].toISOString();
		const lastDateObj = new Date(
			anchorNormalizedDate[anchorNormalizedDate.length - 1],
		);
		lastDateObj.setHours(23, 59, 59, 999);
		const lastDateISO = lastDateObj.toISOString();

		fetchGoogleCalendarEvents(firstDateISO, lastDateISO)
			.then(setGoogleCalendarEvents)
			.catch((error) => {
				console.error("Error fetching Google Calendar events:", error);
				setGoogleCalendarEvents([]);
			});
	}, [anchorNormalizedDate]);

	useEffect(() => {
		const timestamps: string[] = [];
		for (const block of scheduledBlocks) {
			const date = new Date(block.scheduledDate);
			const [h, m, s] = block.scheduledFromTime.split(":").map(Number);
			date.setHours(h, m, s, 0);
			timestamps.push(date.toISOString());
		}
		useAvailabilityStore.getState().hydrateScheduledTimes(timestamps);
	}, [scheduledBlocks]);

	const members = useMemo<Member[]>(() => {
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

		const allMembers = new Map<string, Member>(
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

	const pendingMembers = useMemo<Member[]>(
		() =>
			allAvailabilities
				.filter(
					(a) =>
						a.meetingAvailabilities.length === 0 &&
						a.ifNeededAvailabilities.length === 0,
				)
				.map(({ memberId, displayName, profilePicture }) => ({
					memberId,
					displayName,
					profilePicture,
				})),
		[allAvailabilities],
	);

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
			const padding: (ZotDate | null)[] = Array.from(
				{ length: numPaddingDates },
				() => null,
			);
			return {
				availabilities: [...pageAvailability.availabilities, ...padding],
				ifNeeded: [...pageAvailability.ifNeeded, ...padding],
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

	const doesntNeedDay = useMemo(() => {
		for (let i = 1; i < availabilityTimeBlocks.length; i++) {
			const gap = availabilityTimeBlocks[i] - availabilityTimeBlocks[i - 1];
			if (gap !== 15) return false;
		}

		if (availabilityDates.length === 0) return true;
		const firstPageDate = currentPageAvailability.availabilities[0];
		if (!firstPageDate) return true;

		const lastDate = availabilityDates[availabilityDates.length - 1];
		const { latestTime } = firstPageDate;
		const baseTime = lastDate.day.getTime();
		const boundary = new Date(baseTime);
		boundary.setHours(Math.floor(latestTime / 60), latestTime % 60, 0, 0);

		const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const utcDay = formatInTimeZone(boundary, systemTz, "yyyy-MM-dd");
		const userDay = formatInTimeZone(boundary, userTimezone, "yyyy-MM-dd");
		const userHour = Number(formatInTimeZone(boundary, userTimezone, "H"));
		if (utcDay !== userDay && userHour !== 0) return false;

		return true;
	}, [
		availabilityTimeBlocks,
		availabilityDates,
		currentPageAvailability,
		userTimezone,
	]);

	return {
		availabilityDates,
		setAvailabilityDates,
		ifNeededDates,
		setIfNeededDates,
		googleCalendarEvents,
		members,
		pendingMembers,
		anchorNormalizedDate,
		importGridIsoSet,
		doesntNeedDay,
		currentPageAvailability,
		cancelEdit,
		confirmSave,
		isDirty,
	};
}
