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
	scheduledLabel?: string;
	meetingLink: string;
}

type MeetingForCard = SelectMeeting & {
	hostDisplayName?: string | null;
};

interface ToMeetingCardOptions {
	responderCount?: number;
	timezone?: string;
	scheduledLabel?: string;
}

export type MeetingCardData = MeetingCardViewModel & {
	meeting: MeetingForCard;
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

export type MeetingWithDates = Pick<
	SelectMeeting,
	"id" | "scheduled" | "dates"
> & {
	needsAvailability: boolean;
	allAvailabilityFilled: boolean;
	hostId: string;
};

export function getStartOfTodayMs(): number {
	const d = new Date();
	d.setHours(0, 0, 0, 0);
	return d.getTime();
}

export function isMeetingPast(
	m: Pick<SelectMeeting, "id" | "scheduled" | "dates">,
	scheduledDates: Record<string, number> | undefined,
	todayMs: number,
): boolean {
	if (m.scheduled) {
		const scheduledDate = scheduledDates?.[m.id];
		if (scheduledDate === undefined) return false;
		return scheduledDate < todayMs;
	}
	const dates = (m.dates as string[] | null) ?? [];
	if (dates.length === 0) return false;
	const lastDate = Math.max(...dates.map((d) => new Date(d).getTime()));
	return lastDate < todayMs;
}

export function getMeetingUpcomingPriority(
	m: MeetingWithDates,
	memberId: string,
	upcomingSet: Set<string>,
): number {
	if (m.needsAvailability) return 0;
	if (m.allAvailabilityFilled && m.hostId === memberId) return 1;
	if (upcomingSet.has(m.id)) return 2;
	if (m.scheduled) return 3;
	return 4;
}

export function filterMeetingsByQuery<
	T extends Pick<SelectMeeting, "title" | "location" | "description">,
>(meetings: T[], query: string): T[] {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return meetings;
	return meetings.filter(
		(m) =>
			m.title.toLowerCase().includes(normalized) ||
			(m.location ?? "").toLowerCase().includes(normalized) ||
			(m.description ?? "").toLowerCase().includes(normalized),
	);
}

export function toMeetingCardData(
	meeting: MeetingForCard,
	memberId: string,
	options: Omit<ToMeetingCardOptions, "memberId"> = {},
): MeetingCardData {
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
		meetingOrganizer: meeting.hostDisplayName ?? "Unknown organizer",
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
