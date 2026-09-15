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

const formatDateForMeetingType = (
	dateString: string | undefined,
	meetingType: MeetingType,
) => {
	if (!dateString) return "";
	if (meetingType === "days") {
		const dayIndex = new Date(dateString).getUTCDay();
		return WEEKDAYS[dayIndex] ?? "";
	}
	return formatSingleDate(dateString);
};

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
		dateStart: formatDateForMeetingType(firstDate, meeting.meetingType),
		dateEnd: formatDateForMeetingType(lastDate, meeting.meetingType),
		timeStart: formatTime(localFromTime),
		timeEnd: formatTime(localToTime),
		numResponders: options.responderCount ?? 0,
		location: meeting.location ?? null,
		scheduled: Boolean(meeting.scheduled),
		scheduledLabel: options.scheduledLabel,
		meetingLink: `/availability/${meeting.id}`,
	};
}
