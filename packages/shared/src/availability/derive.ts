import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import type { MemberMeetingAvailability } from "./types";
import { ZotDate } from "./zotdate";

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

	const getTimestamps = (member: MemberMeetingAvailability) =>
		mode === "availabilities"
			? member.meetingAvailabilities
			: member.ifNeededAvailabilities;

	const userAvailability =
		allAvailabilities.find((a) => a.memberId === userId) ?? null;

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
	for (const member of allAvailabilities) {
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

/** Same day layout as `deriveInitialAvailability`, without member data. */
export function buildZotDateRowsForMeetingDays(
	meetingDates: readonly string[],
	availabilityTimeBlocks: readonly number[],
	timeZone?: string,
): ZotDate[] {
	return meetingDates
		.map((meetingDate) => {
			const dateStr = meetingDate.split("T")[0];
			const [year, month, day] = dateStr.split("-").map(Number);
			const date = timeZone
				? fromZonedTime(`${dateStr}T00:00:00`, timeZone)
				: new Date(year, month - 1, day);

			const earliestMinutes = availabilityTimeBlocks[0] ?? 480;
			const latestMinutes =
				(availabilityTimeBlocks[availabilityTimeBlocks.length - 1] ?? 1035) +
				15;

			return new ZotDate(
				date,
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
