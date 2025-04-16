// import type { SuperValidated, ZodValidation } from "sveltekit-superforms";
// import type { AnyZodObject } from "zod";

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

// export interface MemberAvailability {
//     name: string;
//     availableBlocks: number[][];
// }

export interface MemberAvailability {
    memberId: string;  // change this to the name once fetch is changed
    displayName: string;
    meetingAvailabilities: string[];
}

// export interface LoginModalProps {
//     user: App.Locals["user"];
//     form: SuperValidated<ZodValidation<AnyZodObject>>;
//     guestForm: SuperValidated<ZodValidation<AnyZodObject>>;
// }

export interface GuestSession {
    guestName: string;
    meetingId: string;
}
