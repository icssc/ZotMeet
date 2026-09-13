/**
 * Pure helpers behind the meetings list: what counts as past, how the list
 * sorts, the search filter, and the "Scheduled: …" label. Shared so the
 * web's `Meetings` component and the Expo app's sort and filter identically.
 * Typed structurally (`Pick`s of the columns they read) rather than on the
 * Drizzle row, which this package cannot see.
 */

const UPCOMING_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

const UUID_RE =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
	return UUID_RE.test(value);
}

export type MeetingHostNameFields = {
	hostDisplayName?: string | null;
	hostUsername?: string | null;
	hostGoogleName?: string | null;
	hostEmail?: string | null;
};

function emailLocalPart(email: string | null | undefined): string | null {
	const trimmed = email?.trim();
	if (!trimmed?.includes("@")) return null;
	const local = trimmed.split("@")[0]?.trim();
	return local || null;
}

/** Resolved host label for cards, metadata, etc. */
export function getMeetingHostDisplayName(
	host: MeetingHostNameFields | string | null | undefined,
): string {
	const fields =
		typeof host === "string" || host == null ? { hostDisplayName: host } : host;

	for (const candidate of [
		fields.hostDisplayName,
		fields.hostGoogleName,
		fields.hostUsername,
		emailLocalPart(fields.hostEmail),
	]) {
		const trimmed = candidate?.trim();
		if (trimmed && !isUuid(trimmed)) {
			return trimmed;
		}
	}

	return "Unknown organizer";
}

export function getStartOfTodayMs(): number {
	const d = new Date();
	d.setHours(0, 0, 0, 0);
	return d.getTime();
}

/** The columns the past/sort logic reads off a meeting. */
export type MeetingDateFields = {
	id: string;
	scheduled: boolean | null;
	dates: string[] | null;
};

function getMeetingReferenceTime(
	m: MeetingDateFields,
	scheduledDates: Record<string, number> | undefined,
): number | null {
	if (m.scheduled) {
		const scheduledDate = scheduledDates?.[m.id];
		return scheduledDate === undefined ? null : scheduledDate;
	}
	const dates = m.dates ?? [];
	if (dates.length === 0) return null;
	return Math.max(...dates.map((d) => new Date(d).getTime()));
}

export function getMeetingSortTime(
	m: MeetingDateFields,
	scheduledDates: Record<string, number> | undefined,
): number {
	return getMeetingReferenceTime(m, scheduledDates) ?? 0;
}

export function isMeetingPast(
	m: MeetingDateFields,
	scheduledDates: Record<string, number> | undefined,
	todayMs: number,
): boolean {
	const referenceTime = getMeetingReferenceTime(m, scheduledDates);
	if (referenceTime === null) return false;
	return referenceTime < todayMs;
}

export type MeetingWithDates = MeetingDateFields & {
	needsAvailability: boolean;
	allAvailabilityFilled: boolean;
	hostId: string;
};

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
	T extends {
		title: string;
		location: string | null;
		description: string | null;
	},
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

export function getUpcomingMeetingIds(
	scheduledMeetingMap: Record<string, { scheduledDate: Date }>,
): string[] {
	const startOfTodayMs = getStartOfTodayMs();
	const startOfToday = new Date(startOfTodayMs);
	const windowEnd = new Date(startOfTodayMs + UPCOMING_WINDOW_MS);
	return Object.entries(scheduledMeetingMap)
		.filter(
			([, sm]) =>
				sm.scheduledDate >= startOfToday && sm.scheduledDate <= windowEnd,
		)
		.map(([id]) => id);
}

export function formatScheduledTime(time: string): string {
	const [hourStr = "0", minStr = "0"] = time.split(":");
	const hour = Number(hourStr);
	const min = Number(minStr);
	const ampm = hour >= 12 ? "PM" : "AM";
	const h = hour % 12 || 12;
	return min === 0
		? `${h}${ampm}`
		: `${h}:${String(min).padStart(2, "0")}${ampm}`;
}

export function buildScheduledLabel(
	scheduledDate: Date,
	fromTime: string,
	toTime: string,
): string {
	const month = scheduledDate.getUTCMonth() + 1;
	const day = scheduledDate.getUTCDate();
	return `Scheduled: ${month}/${day}, ${formatScheduledTime(fromTime)}-${formatScheduledTime(toTime)}`;
}
