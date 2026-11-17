import { MONTHS } from "../chrono/types";
import {
	type DashboardActionKind,
	getDashboardActionKind,
	getStartOfTodayMs,
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
	todayMs?: number;
}

export interface DashboardModel<T> {
	actionItems: DashboardActionItem<T>[];
	upcoming: DashboardUpcomingItem<T>[];
}

export function buildDashboardModel<T extends MeetingWithDates>({
	meetings,
	memberId,
	scheduledMeetingMap,
	todayMs = getStartOfTodayMs(),
}: DashboardModelInput<T>): DashboardModel<T> {
	const scheduledDates: Record<string, number> = {};
	for (const [id, block] of Object.entries(scheduledMeetingMap)) {
		scheduledDates[id] = block.scheduledDate.getTime();
	}

	const actionItems: DashboardActionItem<T>[] = [];
	for (const meeting of meetings) {
		if (isMeetingPast(meeting, scheduledDates, todayMs)) continue;
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
		if (block.scheduledDate.getTime() < todayMs) continue;
		upcoming.push({ meeting, block });
	}
	upcoming.sort(
		(a, b) =>
			a.block.scheduledDate.getTime() - b.block.scheduledDate.getTime() ||
			a.block.scheduledFromTime.localeCompare(b.block.scheduledFromTime),
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
