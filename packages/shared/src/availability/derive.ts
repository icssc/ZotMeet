import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { getTimeFromHourMinuteString } from "../chrono/time";
import {
	type HourMinuteString,
	isAnchorDateString,
	TimeConstants,
} from "../chrono/types";
import { shiftCalendarDate } from "./grid";
import type { MemberMeetingAvailability } from "./types";
import { ZotDate } from "./zotdate";

/**
 * The column date, on the viewer's clock, for a stored meeting date (the
 * creator's midnight). The meeting starts within the 24 hours after that
 * midnight, so it is the stored date read in timezone or the day after,
 * the start minutes decide which.
 */
function columnDateForMeetingDay(
	creatorMeetingDate: string,
	startMinutes: number,
	timezone: string,
): string {
	// "Days of the week" meetings keep their weekday in every zone.
	const utcDate = creatorMeetingDate.split("T")[0];
	if (isAnchorDateString(utcDate)) return utcDate;

	const [localDate, localTime] = formatInTimeZone(
		new Date(creatorMeetingDate),
		timezone,
		"yyyy-MM-dd HH:mm:ss",
	).split(" ");
	const localMinutes = getTimeFromHourMinuteString(
		localTime as HourMinuteString,
	);

	return startMinutes >= localMinutes
		? localDate
		: shiftCalendarDate(localDate, 1);
}

/**
 * Turns saved responses into the grid's model: one `ZotDate` per meeting
 * day, for either the "available" or "if-needed" dimension.
 */

export type DeriveMode = "availabilities" | "if-needed";

export function deriveInitialAvailability(args: {
	timezone: string;
	meetingDates: readonly string[];
	/** Whose slots fill `ZotDate#availability`; `null` for a viewer with no response. */
	userId: string | null;
	allAvailabilities: readonly MemberMeetingAvailability[];
	availabilityTimeBlocks: readonly number[];
	mode: DeriveMode;
}): ZotDate[] {
	const {
		meetingDates,
		userId,
		allAvailabilities,
		availabilityTimeBlocks,
		mode,
		timezone,
	} = args;

	const earliestMinutes = availabilityTimeBlocks[0] ?? 480;
	const latestMinutes =
		(availabilityTimeBlocks[availabilityTimeBlocks.length - 1] ?? 1035) + 15;

	// Slots before this time of day belong to the previous day's column.
	const minutesPastMidnight = latestMinutes - TimeConstants.MINUTES_PER_DAY;

	const columnDateForSlot = (timestamp: string): string => {
		const [dateStr, time] = formatInTimeZone(
			new Date(timestamp),
			timezone,
			"yyyy-MM-dd HH:mm:ss",
		).split(" ");
		const minutesInDay = getTimeFromHourMinuteString(time as HourMinuteString);

		return minutesInDay < minutesPastMidnight
			? shiftCalendarDate(dateStr, -1)
			: dateStr;
	};

	const getTimestamps = (member: MemberMeetingAvailability) =>
		mode === "availabilities"
			? member.meetingAvailabilities
			: member.ifNeededAvailabilities;

	const userAvailability =
		allAvailabilities.find((a) => a.memberId === userId) ?? null;

	const availabilitiesByDate = new Map<string, string[]>();
	if (userAvailability) {
		getTimestamps(userAvailability).forEach((timeStr) => {
			const dateStr = columnDateForSlot(timeStr);
			if (!availabilitiesByDate.has(dateStr)) {
				availabilitiesByDate.set(dateStr, []);
			}
			availabilitiesByDate.get(dateStr)?.push(timeStr);
		});
	}

	const timestampsByDate = new Map<string, Map<string, string[]>>();
	for (const member of allAvailabilities) {
		for (const timestamp of getTimestamps(member)) {
			const dateStr = columnDateForSlot(timestamp);
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
		.map((creatorMeetingDate) => {
			const columnDate = columnDateForMeetingDay(
				creatorMeetingDate,
				earliestMinutes,
				timezone,
			);
			const columnDayStart = fromZonedTime(`${columnDate}T00:00:00`, timezone);

			return new ZotDate(
				columnDayStart,
				earliestMinutes,
				latestMinutes,
				false,
				availabilitiesByDate.get(columnDate) || [],
				Object.fromEntries(timestampsByDate.get(columnDate) || new Map()),
				timezone,
			);
		})
		.sort((a, b) => a.day.getTime() - b.day.getTime());
}

/**
 * Rebuilds `ZotDate`s for another time zone.
 */
export function deriveAvailabilityForTimezone(args: {
	timezone: string;
	meetingDates: readonly string[];
	userId: string | null;
	availabilityDates: readonly ZotDate[];
	ifNeededDates: readonly ZotDate[];
	availabilityTimeBlocks: readonly number[];
}): { availabilityDates: ZotDate[]; ifNeededDates: ZotDate[] } {
	const {
		timezone,
		meetingDates,
		userId,
		availabilityDates,
		ifNeededDates,
		availabilityTimeBlocks,
	} = args;

	const timesByMember = new Map<
		string,
		{ available: string[]; ifNeeded: string[] }
	>();

	const buildTimesByMember = (
		columns: readonly ZotDate[],
		list: "available" | "ifNeeded",
	) => {
		for (const column of columns) {
			for (const [time, memberIds] of Object.entries(
				column.groupAvailability,
			)) {
				for (const memberId of memberIds) {
					let times = timesByMember.get(memberId);
					if (times === undefined) {
						times = { available: [], ifNeeded: [] };
						timesByMember.set(memberId, times);
					}
					times[list].push(time);
				}
			}
		}
	};
	buildTimesByMember(availabilityDates, "available");
	buildTimesByMember(ifNeededDates, "ifNeeded");

	const allAvailabilities = Array.from(timesByMember, ([memberId, times]) => ({
		memberId,
		displayName: "",
		profilePicture: null,
		meetingAvailabilities: times.available,
		ifNeededAvailabilities: times.ifNeeded,
	}));

	return {
		availabilityDates: deriveInitialAvailability({
			timezone,
			meetingDates,
			userId,
			allAvailabilities,
			availabilityTimeBlocks,
			mode: "availabilities",
		}),
		ifNeededDates: deriveInitialAvailability({
			timezone,
			meetingDates,
			userId,
			allAvailabilities,
			availabilityTimeBlocks,
			mode: "if-needed",
		}),
	};
}

/** Same day layout as `deriveInitialAvailability`, without member data. */
export function buildZotDateRowsForMeetingDays(
	meetingDates: readonly string[],
	availabilityTimeBlocks: readonly number[],
	timeZone: string,
): ZotDate[] {
	return meetingDates
		.map((creatorMeetingDate) => {
			const earliestMinutes = availabilityTimeBlocks[0] ?? 480;
			const latestMinutes =
				(availabilityTimeBlocks[availabilityTimeBlocks.length - 1] ?? 1035) +
				15;
			const columnDate = columnDateForMeetingDay(
				creatorMeetingDate,
				earliestMinutes,
				timeZone,
			);
			const columnDayStart = fromZonedTime(`${columnDate}T00:00:00`, timeZone);

			return new ZotDate(
				columnDayStart,
				earliestMinutes,
				latestMinutes,
				false,
				[],
				{},
				timeZone,
			);
		})
		.sort((a, b) => a.day.getTime() - b.day.getTime());
}

export interface CurrentPageAvailability {
	availabilities: (ZotDate | null)[];
	ifNeeded: (ZotDate | null)[];
}

/**
 * The columns on one page. The last page is padded with `null` columns so the
 * grid keeps its width; renderers draw those as empty paper.
 */
export function sliceCurrentPageAvailability(
	availabilityDates: readonly ZotDate[],
	ifNeededDates: readonly ZotDate[],
	currentPage: number,
	itemsPerPage: number,
): CurrentPageAvailability {
	const lastPage = Math.floor((availabilityDates.length - 1) / itemsPerPage);
	const numPaddingDates =
		availabilityDates.length % itemsPerPage === 0
			? 0
			: itemsPerPage - (availabilityDates.length % itemsPerPage);
	const datesToOffset = currentPage * itemsPerPage;

	const pageAvailability: CurrentPageAvailability = {
		availabilities: availabilityDates.slice(
			datesToOffset,
			datesToOffset + itemsPerPage,
		),
		ifNeeded: ifNeededDates.slice(datesToOffset, datesToOffset + itemsPerPage),
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
}
