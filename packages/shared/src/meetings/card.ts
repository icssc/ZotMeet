import { convertTimeFromUTC } from "../chrono/time";
import { WEEKDAYS } from "../chrono/types";
import type { MeetingType } from "./schema";
import { getMeetingHostDisplayName } from "./utils";

/**
 * Turns a meeting row into what a meeting card shows. Both apps render the
 * same card from the same view model, so the date/time/organizer formatting
 * lives here once. The web app re-exports this from
 * `src/lib/meeting-card/mapper.ts`.
 */

export interface MeetingCardViewModel {
	meetingName: string;
	meetingOrganizer: string;
	dateStart: string;
	dateEnd: string;
	timeStart: string;
	timeEnd: string;
	numResponders: number;
	location: string | null;
	scheduled: boolean;
	scheduledLabel?: string;
	meetingLink: string;
}

/** The columns a card reads — a `meetings` row (or its API shape) has them. */
export type MeetingForCard = {
	id: string;
	title: string;
	hostId: string;
	dates: string[] | null;
	fromTime: string;
	toTime: string;
	meetingType: MeetingType;
	location: string | null;
	scheduled: boolean | null;
	hostDisplayName?: string | null;
};

interface ToMeetingCardOptions {
	responderCount?: number;
	timezone?: string;
	scheduledLabel?: string;
}

/**
 * Which of the five card treatments a meeting gets. Both apps derive it
 * with `meetingCardVariant` and paint the banner for it themselves.
 */
export type MeetingCardVariant =
	| "default"
	| "action-required"
	| "schedule-alert"
	| "upcoming"
	| "scheduled";

export interface MeetingCardVariantInput {
	isPast: boolean;
	needsAvailability: boolean;
	scheduled: boolean;
	allAvailabilityFilled: boolean;
	isOwner: boolean;
	isUpcoming: boolean;
}

/**
 * Past meetings are always plain. Otherwise, in priority order: the viewer
 * still owes availability; the host can schedule now; scheduled within the
 * upcoming window; scheduled; plain.
 */
export function meetingCardVariant({
	isPast,
	needsAvailability,
	scheduled,
	allAvailabilityFilled,
	isOwner,
	isUpcoming,
}: MeetingCardVariantInput): MeetingCardVariant {
	if (isPast) return "default";
	if (needsAvailability) return "action-required";
	if (!scheduled && allAvailabilityFilled && isOwner) return "schedule-alert";
	if (scheduled && isUpcoming) return "upcoming";
	if (scheduled) return "scheduled";
	return "default";
}

/** `"9/1 - 9/5"` for a range, or just the start when it is a single day. */
export function formatMeetingCardDateLabel(
	dateStart: string,
	dateEnd: string,
): string {
	return dateStart && dateEnd && dateStart !== dateEnd
		? `${dateStart} - ${dateEnd}`
		: dateStart;
}

export type MeetingCardData<T extends MeetingForCard = MeetingForCard> =
	MeetingCardViewModel & {
		meeting: T;
		isOwner: boolean;
	};

const formatSingleDate = (dateString?: string) => {
	if (!dateString) return "";
	return new Intl.DateTimeFormat("en-US", {
		month: "numeric",
		day: "numeric",
		timeZone: "UTC",
	}).format(new Date(dateString));
};

/**
 * A "days of the week" meeting's weekdays, Sunday first, with runs of three
 * or more collapsed: `"Mon - Wed, Fri"`. A run through Saturday into Sunday
 * stays together at the end: `"Fri - Sun"`, not `"Sun, Fri, Sat"`. Its dates
 * are anchor dates, read in UTC like the rest of this file.
 */
export function formatMeetingWeekdays(dates: readonly string[]): string {
	let days = [...new Set(dates.map((d) => new Date(d).getUTCDay()))].sort(
		(a, b) => a - b,
	);

	// Move the days that continue Saturday's run (Sun, Mon, …) to the end.
	if (days.length < 7 && days[0] === 0 && days.at(-1) === 6) {
		let k = 0;
		while (days[k] === k) k++;
		days = [...days.slice(k), ...days.slice(0, k)];
	}

	const parts: string[] = [];
	for (let i = 0; i < days.length; ) {
		let j = i;
		while (j + 1 < days.length && days[j + 1] === (days[j] + 1) % 7) j++;
		const first = WEEKDAYS[days[i]];
		const last = WEEKDAYS[days[j]];
		if (j - i >= 2) parts.push(`${first} - ${last}`);
		else parts.push(...days.slice(i, j + 1).map((d) => WEEKDAYS[d]));
		i = j + 1;
	}
	return parts.join(", ");
}

const formatTime = (time: string) => {
	const [hour = "0", minute = "0"] = time.split(":");
	const date = new Date();
	date.setHours(Number(hour), Number(minute));

	return date.toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
};

export function toMeetingCardData<T extends MeetingForCard>(
	meeting: T,
	memberId: string,
	options: ToMeetingCardOptions = {},
): MeetingCardData<T> {
	return {
		meeting,
		isOwner: meeting.hostId === memberId,
		...toMeetingCardProps(meeting, options),
	};
}

export function toMeetingCardProps(
	meeting: MeetingForCard,
	options: ToMeetingCardOptions = {},
): MeetingCardViewModel {
	const dates = [...(meeting.dates ?? [])].sort(
		(a, b) => new Date(a).getTime() - new Date(b).getTime(),
	);
	const firstDate = dates[0];
	const lastDate = dates[dates.length - 1];

	const userTimezone =
		options.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
	const referenceDate = firstDate ?? new Date().toISOString();
	const localFromTime = convertTimeFromUTC(
		meeting.fromTime,
		userTimezone,
		referenceDate,
	);
	const localToTime = convertTimeFromUTC(
		meeting.toTime,
		userTimezone,
		referenceDate,
	);

	return {
		meetingName: meeting.title,
		meetingOrganizer: getMeetingHostDisplayName({
			hostDisplayName: meeting.hostDisplayName,
		}),
		// A weekday list is one label; `formatMeetingCardDateLabel` shows
		// `dateStart` alone when `dateEnd` is empty.
		...(meeting.meetingType === "days"
			? { dateStart: formatMeetingWeekdays(dates), dateEnd: "" }
			: {
					dateStart: formatSingleDate(firstDate),
					dateEnd: formatSingleDate(lastDate),
				}),
		timeStart: formatTime(localFromTime),
		timeEnd: formatTime(localToTime),
		numResponders: options.responderCount ?? 0,
		location: meeting.location ?? null,
		scheduled: Boolean(meeting.scheduled),
		scheduledLabel: options.scheduledLabel,
		meetingLink: `/availability/${meeting.id}`,
	};
}
