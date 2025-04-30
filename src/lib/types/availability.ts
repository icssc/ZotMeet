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
