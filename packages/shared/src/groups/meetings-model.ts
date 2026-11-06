import { localMidnightFromIsoDate } from "../chrono/time";
import { formatMeetingWeekdays } from "../meetings/card";
import type { GroupMeetingItem } from "./schema";

export const GROUP_MEETINGS_FILTERS = ["all", "created", "upcoming"] as const;
export type GroupMeetingsFilter = (typeof GROUP_MEETINGS_FILTERS)[number];

export const GROUP_MEETINGS_FILTER_LABELS: Record<GroupMeetingsFilter, string> =
	{
		all: "All",
		created: "By You",
		upcoming: "Upcoming",
	};

export type GroupMeetingStatus = "availability-needed" | "responded" | null;

const DAY_MS = 24 * 60 * 60 * 1000;
const UPCOMING_WINDOW_DAYS = 3;

export function groupMeetingStatus(
	meeting: Pick<GroupMeetingItem, "userHasResponded" | "scheduledDate">,
): GroupMeetingStatus {
	if (meeting.userHasResponded) return "responded";
	if (!meeting.scheduledDate) return "availability-needed";
	return null;
}

export function isGroupMeetingUpcoming(
	meeting: Pick<GroupMeetingItem, "scheduledDate">,
	todayMs: number,
): boolean {
	if (!meeting.scheduledDate) return false;
	const scheduledMs = new Date(meeting.scheduledDate).getTime();
	return (
		scheduledMs >= todayMs &&
		scheduledMs <= todayMs + UPCOMING_WINDOW_DAYS * DAY_MS
	);
}

function formatShortDate(date: Date): string {
	return `${date.getMonth() + 1}/${date.getDate()}/${String(date.getFullYear()).slice(-2)}`;
}

function dayNumber(date: Date): number {
	return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS;
}

export function formatGroupMeetingDates(
	meeting: Pick<GroupMeetingItem, "meetingType" | "dates">,
): string {
	if (meeting.meetingType === "days") {
		return formatMeetingWeekdays(meeting.dates);
	}

	const days = [...new Set(meeting.dates.map((iso) => iso.substring(0, 10)))]
		.sort()
		.map(localMidnightFromIsoDate);
	if (days.length === 0) return "";
	if (days.length === 1) return formatShortDate(days[0]);

	const consecutive = days.every(
		(day, i) => i === 0 || dayNumber(day) - dayNumber(days[i - 1]) === 1,
	);
	return consecutive
		? `${formatShortDate(days[0])} - ${formatShortDate(days[days.length - 1])}`
		: "Multiple Dates";
}

function sortTime(meeting: GroupMeetingItem): number {
	const iso = meeting.scheduledDate ?? meeting.dates[0];
	return iso ? new Date(iso).getTime() : 0;
}

export function buildGroupMeetingsModel({
	meetings,
	memberId,
	filter,
	search,
	todayMs,
}: {
	meetings: GroupMeetingItem[];
	memberId: string;
	filter: GroupMeetingsFilter;
	search: string;
	todayMs: number;
}): {
	actionRequired: GroupMeetingItem[];
	upcoming: GroupMeetingItem[];
	rest: GroupMeetingItem[];
} {
	const query = search.trim().toLowerCase();
	const filtered = meetings
		.filter((meeting) => meeting.title.toLowerCase().includes(query))
		.filter((meeting) => {
			if (filter === "created") return meeting.hostId === memberId;
			if (filter === "upcoming")
				return isGroupMeetingUpcoming(meeting, todayMs);
			return true;
		})
		.sort((a, b) => sortTime(a) - sortTime(b));

	const actionRequired: GroupMeetingItem[] = [];
	const upcoming: GroupMeetingItem[] = [];
	const rest: GroupMeetingItem[] = [];
	for (const meeting of filtered) {
		if (groupMeetingStatus(meeting) === "availability-needed") {
			actionRequired.push(meeting);
		} else if (isGroupMeetingUpcoming(meeting, todayMs)) {
			upcoming.push(meeting);
		} else {
			rest.push(meeting);
		}
	}

	return { actionRequired, upcoming, rest };
}
