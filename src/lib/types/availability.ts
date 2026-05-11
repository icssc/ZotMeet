// import type { SuperValidated, ZodValidation } from "sveltekit-superforms";
// import type { AnyZodObject } from "zod";

import type { SelectAvailability, SelectMember } from "@/db/schema";

export type AvailabilityBlockType = {
	zotDateIndex: number;
	blockIndex: number;
};

export type AvailabilityView = "group" | "personal" | "schedule";

export type SelectionStateType = {
	earlierDateIndex: number;
	laterDateIndex: number;
	earlierBlockIndex: number;
	laterBlockIndex: number;
};

export function rangeCoversCell(
	range: SelectionStateType | undefined,
	zotDateIndex: number,
	blockIndex: number,
): boolean {
	if (!range) return false;
	return (
		range.earlierDateIndex <= zotDateIndex &&
		zotDateIndex <= range.laterDateIndex &&
		range.earlierBlockIndex <= blockIndex &&
		blockIndex <= range.laterBlockIndex
	);
}

//TODO: Guest
// export interface GuestSession {
//     guestName: string;
//     meetingId: string;
// }

export type MemberMeetingAvailability = Pick<
	SelectAvailability,
	"memberId" | "meetingAvailabilities" | "ifNeededAvailabilities"
> &
	Pick<SelectMember, "displayName" | "profilePicture">;

export type Member = Pick<
	MemberMeetingAvailability,
	"memberId" | "displayName" | "profilePicture"
>;

export interface GoogleCalendarEvent {
	id: string;
	summary: string;
	start: string;
	end: string;
	calendarColor: string;
	calendarId?: string | null; // For UI calendar list groupings
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
