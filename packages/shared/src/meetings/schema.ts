import { z } from "zod";

/**
 * The meeting API contract: what a client sends to create a meeting and what
 * it gets back when reading one. Consumed by the web app's route handlers and
 * server action on one side and the Expo app's API client on the other, so
 * both validate by exactly the same rules.
 */

export const MEETING_TYPES = ["dates", "days"] as const;
export type MeetingType = (typeof MEETING_TYPES)[number];

/** "HH:MM:SS", 24-hour, zero-padded — the shape the `time` columns store. */
export const HOUR_MINUTE_SECOND_REGEX = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

function isValidIanaTimeZone(timeZone: string): boolean {
	try {
		new Intl.DateTimeFormat(undefined, { timeZone });
		return true;
	} catch {
		return false;
	}
}

function isUnique(values: readonly string[]): boolean {
	return new Set(values).size === values.length;
}

export const createMeetingSchema = z.object({
	title: z.string().trim().min(1, "Meeting name is required").max(100),
	/** UTC wall-clock, already converted with `convertTimeToUTC`. */
	fromTime: z
		.string()
		.regex(HOUR_MINUTE_SECOND_REGEX, "Expected a time in HH:MM:SS"),
	toTime: z
		.string()
		.regex(HOUR_MINUTE_SECOND_REGEX, "Expected a time in HH:MM:SS"),
	/** IANA zone the times were entered in, e.g. "America/Los_Angeles". */
	timezone: z
		.string()
		.min(1)
		.refine(isValidIanaTimeZone, "Expected an IANA timezone"),
	/**
	 * ISO instants from `Date#toISOString()` — real dates for a "dates"
	 * meeting, `ANCHOR_DATES` for a "days" meeting. `datetime()` accepts the
	 * `Z` suffix only, which is what `toISOString()` produces.
	 */
	dates: z
		.array(z.string().datetime())
		.min(1, "Pick at least one day")
		.refine(isUnique, "Dates must be unique"),
	meetingType: z.enum(MEETING_TYPES).default("dates"),
	description: z.string().max(500).optional(),
});

/** What a client sends: `meetingType` may be omitted. */
export type CreateMeetingInput = z.input<typeof createMeetingSchema>;
/** What the server works with, after defaults are applied. */
export type CreateMeetingData = z.output<typeof createMeetingSchema>;

export type CreateMeetingResponse = { id: string };

/**
 * A meeting as the API returns it: the `meetings` row, JSON-serialised, plus
 * the response counts the meeting screen shows. Kept by hand rather than
 * inferred because this package cannot import the Drizzle schema — the GET
 * route builds its body with `satisfies MeetingResponse`, so a column change
 * fails the web typecheck instead of surfacing as a runtime mismatch here.
 */
export type MeetingResponse = {
	id: string;
	title: string;
	description: string | null;
	location: string | null;
	fromTime: string;
	toTime: string;
	timezone: string;
	dates: string[];
	meetingType: MeetingType;
	hostId: string;
	group_id: string | null;
	scheduled: boolean | null;
	membersCanInvite: boolean;
	createdAt: string;
	attendees: {
		/** Members who have filled in some availability. */
		responded: number;
		/** Members attached to the meeting, whether or not they have responded. */
		total: number;
	};
};

export type ApiErrorResponse = {
	error: string;
	/** `ZodError#flatten()` output when the request failed validation. */
	issues?: unknown;
};

/**
 * One row of `GET /api/meetings` — a meeting the member hosts or has joined,
 * with everything the meetings list needs to sort it, badge it, and draw its
 * card. Mirrors what `app/summary/page.tsx` assembles for the web's
 * `<Meetings>`: the `getMeetings` row plus the responder count and the first
 * scheduled block, flattened onto the meeting so the client does no joining.
 */
export type MeetingListItem = {
	id: string;
	title: string;
	description: string | null;
	location: string | null;
	fromTime: string;
	toTime: string;
	timezone: string;
	dates: string[];
	meetingType: MeetingType;
	hostId: string;
	group_id: string | null;
	scheduled: boolean | null;
	membersCanInvite: boolean;
	createdAt: string;
	/** The host's display name, for the card's organizer line. */
	hostDisplayName: string | null;
	/** Unscheduled, and this member has not filled in availability yet. */
	needsAvailability: boolean;
	/** Unscheduled, and every attached member has filled in availability. */
	allAvailabilityFilled: boolean;
	responderCount: number;
	/** The earliest scheduled block, when the meeting is scheduled. */
	scheduledAt: {
		/** ISO instant of the scheduled date (a UTC midnight). */
		date: string;
		fromTime: string;
		toTime: string;
	} | null;
};

export type MeetingsListResponse = {
	/** Whose meetings these are — what the list compares `hostId` against. */
	memberId: string;
	meetings: MeetingListItem[];
};

/**
 * Result of the member actions on a meeting — `POST /api/meetings/:id/archive`
 * and `.../leave` — the wire form of the web's `MeetingMemberActionResult`.
 */
export type MeetingMemberActionResponse =
	| { success: true; error?: undefined }
	| { success: false; error: string };
