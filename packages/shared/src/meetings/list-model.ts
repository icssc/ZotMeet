import {
	filterMeetingsByQuery,
	getMeetingSortTime,
	getMeetingUpcomingPriority,
	getStartOfTodayMs,
	isMeetingPast,
	type MeetingWithDates,
} from "./utils";

/**
 * The meetings list as both apps show it: three filter chips with counts, a
 * search box, and the cards in the order the active filter wants. The web's
 * `Meetings` (`src/components/summary/meetings.tsx`) and the Expo app's used
 * to each carry this block of `useMemo`s; it is one pure function here and
 * each wraps it in a single `useMemo`.
 */

export const MEETINGS_LIST_FILTERS = ["upcoming", "past", "by-you"] as const;
export type MeetingsListFilter = (typeof MEETINGS_LIST_FILTERS)[number];

export const MEETINGS_LIST_FILTER_LABELS: Record<MeetingsListFilter, string> = {
	upcoming: "Upcoming",
	past: "Past",
	"by-you": "By You",
};

/** The columns the list reads, on top of what the past/sort logic needs. */
export type MeetingForList = MeetingWithDates & {
	title: string;
	location: string | null;
	description: string | null;
};

export interface MeetingsListModelInput<T extends MeetingForList> {
	meetings: T[];
	memberId: string;
	filter: MeetingsListFilter;
	search: string;
	/** Scheduled meeting id → epoch ms of its scheduled date. */
	scheduledDates: Record<string, number> | undefined;
	/** Ids scheduled within the upcoming window (`getUpcomingMeetingIds`). */
	upcomingSet: Set<string>;
	/** Start of "today" on the caller's clock; defaults to now. */
	todayMs?: number;
}

export interface MeetingsListModel<T extends MeetingForList> {
	/** Chip counts, taken before the search filter. */
	counts: Record<MeetingsListFilter, number>;
	/** The active filter's meetings, matching the search, in display order. */
	meetings: T[];
}

export function buildMeetingsListModel<T extends MeetingForList>({
	meetings,
	memberId,
	filter,
	search,
	scheduledDates,
	upcomingSet,
	todayMs = getStartOfTodayMs(),
}: MeetingsListModelInput<T>): MeetingsListModel<T> {
	const isPast = (m: T) => isMeetingPast(m, scheduledDates, todayMs);
	const isByYou = (m: T) => m.hostId === memberId;

	const counts: Record<MeetingsListFilter, number> = {
		upcoming: meetings.filter((m) => !isPast(m)).length,
		past: meetings.filter(isPast).length,
		"by-you": meetings.filter(isByYou).length,
	};

	const filtered =
		filter === "by-you"
			? meetings.filter(isByYou)
			: filter === "past"
				? meetings.filter(isPast)
				: meetings.filter((m) => !isPast(m));

	const searched = filterMeetingsByQuery(filtered, search);

	// Past meetings newest first; everything else by how much attention the
	// viewer owes it, then insertion order.
	const sorted =
		filter === "past"
			? [...searched].sort(
					(a, b) =>
						getMeetingSortTime(b, scheduledDates) -
						getMeetingSortTime(a, scheduledDates),
				)
			: [...searched].sort(
					(a, b) =>
						getMeetingUpcomingPriority(a, memberId, upcomingSet) -
						getMeetingUpcomingPriority(b, memberId, upcomingSet),
				);

	return { counts, meetings: sorted };
}
