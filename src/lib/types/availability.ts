import type { MemberMeetingAvailability as SharedMemberMeetingAvailability } from "@zotmeet/shared";
import type { SelectAvailability, SelectMember } from "@/db/schema";

/*
 * The grid vocabulary lives in `@zotmeet/shared` so the Expo app can use it;
 * re-exported here to keep this module's import path stable.
 */
export type {
	AvailabilityBlockType,
	AvailabilityView,
	Member,
	SelectionStateType,
} from "@zotmeet/shared";
export { rangeCoversCell } from "@zotmeet/shared";

export type MemberMeetingAvailability = Pick<
	SelectAvailability,
	"memberId" | "meetingAvailabilities" | "ifNeededAvailabilities"
> &
	Pick<SelectMember, "displayName" | "profilePicture">;

/**
 * The shared package cannot import the Drizzle schema, so it keeps its own
 * copy of this shape; this pins the two together at typecheck.
 */
const _memberAvailabilityMatchesShared: SharedMemberMeetingAvailability =
	null as unknown as MemberMeetingAvailability;
const _sharedMatchesMemberAvailability: MemberMeetingAvailability =
	null as unknown as SharedMemberMeetingAvailability;
void _memberAvailabilityMatchesShared;
void _sharedMatchesMemberAvailability;

export interface GoogleCalendarEvent {
	id: string;
	summary: string;
	start: string;
	end: string;
	calendarColor: string;
	calendarId?: string | null;
	/** Always populated by the server; falls back to id or "Unknown Calendar". */
	calendarName: string;
}

export interface GoogleCalendarInfo {
	id: string;
	name: string;
	color: string;
}

export interface GoogleCalendarEventLayoutInfo {
	id: string;
	summary: string;

	originalStartMinutes: number;
	originalEndMinutes: number;

	clampedStartMinutes: number;
	clampedEndMinutes: number;

	assignedColumn: number;
	gridColumnCount: number;

	startDateString: string;
	startBlockIndex: number;
	endBlockIndex: number;
	calendarColor: string;
}

export interface EventSegment {
	eventId: string;
	summary: string;
	layoutInfo: GoogleCalendarEventLayoutInfo;

	isStartOfEventInCell: boolean;
	isEndOfEventInCell: boolean;

	cellAssignedColumn: number;
	cellGridColumnCount: number;
	calendarColor: string;
}

export type ProcessedCellEventSegments = Map<
	string, // Key: `zotDateIndex_blockIndex`
	EventSegment[]
>;
