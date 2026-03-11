import type { SelectMeeting } from "@/db/schema";
import { convertTimeFromUTC } from "@/lib/availability/utils";
import { WEEKDAYS } from "@/lib/types/chrono";

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
	meetingLink: string;
}

type MeetingForCard = SelectMeeting & {
	hostDisplayName?: string | null;
};

interface ToMeetingCardOptions {
	responderCount?: number;
	timezone?: string;
}

const formatSingleDate = (dateString?: string) => {
	if (!dateString) return "";
	return new Intl.DateTimeFormat("en-US", {
		month: "numeric",
		day: "numeric",
	}).format(new Date(dateString));
};

const formatDateForMeetingType = (
	dateString: string | undefined,
	meetingType: SelectMeeting["meetingType"],
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
		meetingOrganizer: meeting.hostDisplayName ?? "Unknown organizer",
		dateStart: formatDateForMeetingType(firstDate, meeting.meetingType),
		dateEnd: formatDateForMeetingType(lastDate, meeting.meetingType),
		timeStart: formatTime(localFromTime),
		timeEnd: formatTime(localToTime),
		numResponders: options.responderCount ?? 0,
		location: meeting.location,
		scheduled: Boolean(meeting.scheduled),
		meetingLink: `/availability/${meeting.id}`,
	};
}
