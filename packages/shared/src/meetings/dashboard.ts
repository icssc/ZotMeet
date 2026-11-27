import { MONTHS } from "../chrono/types";
import {
	buildScheduledMeetingsMeta,
	type DashboardActionKind,
	getDashboardActionKind,
	isMeetingPast,
	type MeetingWithDates,
	type ScheduledMeetingBlock,
} from "./utils";

export interface DashboardActionItem<T> {
	meeting: T;
	kind: DashboardActionKind;
}

export interface DashboardUpcomingItem<T> {
	meeting: T;
	block: ScheduledMeetingBlock;
}

export interface DashboardModelInput<T extends MeetingWithDates> {
	meetings: T[];
	memberId: string;
	scheduledMeetingMap: Record<string, ScheduledMeetingBlock>;
	nowMs?: number;
}

export interface DashboardModel<T> {
	actionItems: DashboardActionItem<T>[];
	upcoming: DashboardUpcomingItem<T>[];
}

export function buildDashboardModel<T extends MeetingWithDates>({
	meetings,
	memberId,
	scheduledMeetingMap,
	nowMs = Date.now(),
}: DashboardModelInput<T>): DashboardModel<T> {
	const { scheduledDates } = buildScheduledMeetingsMeta(scheduledMeetingMap);

	const actionItems: DashboardActionItem<T>[] = [];
	for (const meeting of meetings) {
		if (isMeetingPast(meeting, scheduledDates, nowMs)) continue;
		const kind = getDashboardActionKind(meeting, memberId);
		if (kind) actionItems.push({ meeting, kind });
	}
	actionItems.sort(
		(a, b) => Number(a.kind === "schedule") - Number(b.kind === "schedule"),
	);

	const upcoming: DashboardUpcomingItem<T>[] = [];
	for (const meeting of meetings) {
		const block = scheduledMeetingMap[meeting.id];
		if (!meeting.scheduled || !block) continue;
		if (scheduledDates[meeting.id] < nowMs) continue;
		upcoming.push({ meeting, block });
	}
	upcoming.sort(
		(a, b) => scheduledDates[a.meeting.id] - scheduledDates[b.meeting.id],
	);

	return { actionItems, upcoming };
}

const UPCOMING_WEEKDAYS = [
	"SUN",
	"MON",
	"TUES",
	"WED",
	"THURS",
	"FRI",
	"SAT",
] as const;

export function formatUpcomingDate(scheduledDate: Date): {
	weekday: string;
	month: string;
	day: number;
} {
	return {
		weekday: UPCOMING_WEEKDAYS[scheduledDate.getUTCDay()] ?? "",
		month: MONTHS[scheduledDate.getUTCMonth()] ?? "",
		day: scheduledDate.getUTCDate(),
	};
}
