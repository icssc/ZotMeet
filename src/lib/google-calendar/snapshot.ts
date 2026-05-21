import type { MeetingGoogleCalendarSnapshot } from "@/db/schema";

export function snapshotsMatch(
	a: MeetingGoogleCalendarSnapshot,
	b: MeetingGoogleCalendarSnapshot,
): boolean {
	return (
		a.date === b.date && a.fromTime === b.fromTime && a.toTime === b.toTime
	);
}

export type AddToCalendarLabelState =
	| "add"
	| "in_sync"
	| "drifted"
	| "non_contiguous";

export function deriveAddToCalendarLabelState({
	storedSnapshot,
	currentInterval,
}: {
	storedSnapshot: MeetingGoogleCalendarSnapshot | null;
	currentInterval: MeetingGoogleCalendarSnapshot | null;
}): AddToCalendarLabelState {
	if (currentInterval === null) {
		return "non_contiguous";
	}
	if (storedSnapshot === null) {
		return "add";
	}
	return snapshotsMatch(storedSnapshot, currentInterval)
		? "in_sync"
		: "drifted";
}
