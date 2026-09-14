import {
	convertTimeFromUTC,
	generateTimeBlocks,
	getTimeFromHourMinuteString,
	sortMeetingIsoDatesAsc,
} from "../chrono/time";
import type { HourMinuteString } from "../chrono/types";

/** The columns the window derivation reads off a meeting. */
export type MeetingWindowFields = {
	dates: string[];
	/** UTC wall-clock `"HH:MM:SS"` (see storage conventions). */
	fromTime: string;
	toTime: string;
};

export interface MeetingWindow {
	/** The meeting's dates, earliest first. */
	sortedDates: string[];
	/** The date the UTC times are converted against — the earliest one. */
	referenceDate: string;
	/** Minutes past local midnight the grid starts and ends. */
	fromTimeMinutes: number;
	toTimeMinutes: number;
	/** One entry per 15-minute row, as minutes past midnight. */
	availabilityTimeBlocks: number[];
}

/**
 * The availability grid's time axis in the viewer's timezone. The stored
 * `fromTime`/`toTime` are UTC; they are converted against the meeting's first
 * date (DST can make a later date differ) and then cut into 15-minute rows.
 * Both availability screens used to run these five calls inline.
 */
export function deriveMeetingWindow(
	meeting: MeetingWindowFields,
	timeZone: string,
): MeetingWindow {
	const sortedDates = sortMeetingIsoDatesAsc(meeting.dates);
	const referenceDate = sortedDates[0] ?? meeting.dates[0];

	// `convertTimeFromUTC` returns "HH:mm:ss" but is typed as `string`.
	const fromTimeMinutes = getTimeFromHourMinuteString(
		convertTimeFromUTC(
			meeting.fromTime,
			timeZone,
			referenceDate,
		) as HourMinuteString,
	);
	const toTimeMinutes = getTimeFromHourMinuteString(
		convertTimeFromUTC(
			meeting.toTime,
			timeZone,
			referenceDate,
		) as HourMinuteString,
	);

	return {
		sortedDates,
		referenceDate,
		fromTimeMinutes,
		toTimeMinutes,
		availabilityTimeBlocks: generateTimeBlocks(fromTimeMinutes, toTimeMinutes),
	};
}
