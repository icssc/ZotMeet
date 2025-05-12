// import type { SuperValidated, ZodValidation } from "sveltekit-superforms";
// import type { AnyZodObject } from "zod";

import { SelectAvailability, SelectMember } from "@/db/schema";

export type AvailabilityBlockType = {
    zotDateIndex: number;
    blockIndex: number;
};

export type SelectionStateType = {
    earlierDateIndex: number;
    laterDateIndex: number;
    earlierBlockIndex: number;
    laterBlockIndex: number;
};

//TODO: Guest
// export interface GuestSession {
//     guestName: string;
//     meetingId: string;
// }

export type MemberMeetingAvailability = Pick<
    SelectAvailability,
    "memberId" | "meetingAvailabilities"
> &
    Pick<SelectMember, "displayName">;

export interface GoogleCalendarEvent {
    id: string;
    summary: string;
    start: string;
    end: string;
}

export interface GoogleCalendarEventLayoutInfo {
    id: string;
    summary: string;

    originalStartMinutes: number;
    originalEndMinutes: number;

    clampedStartMinutes: number;
    clampedEndMinutes: number;

    assignedColumn: number;
    maxConcurrentInGroup: number;

    startDateString: string;
    startBlockIndex: number;
    endBlockIndex: number;
}

export interface EventSegment {
    eventId: string;
    summary: string;
    layoutInfo: GoogleCalendarEventLayoutInfo;

    isStartOfEventInCell: boolean;
    isEndOfEventInCell: boolean;

    cellAssignedColumn: number;
    cellMaxConcurrentInGroup: number;
}

export type ProcessedCellEventSegments = Map<
    string, // Key: `zotDateIndex_blockIndex`
    EventSegment[]
>;
