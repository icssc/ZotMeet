import { z } from "zod";
import { HOUR_MINUTE_SECOND_REGEX } from "./schema";

/**
 * The "schedule a meeting" contract: what a client sends when the host saves
 * the scheduled time blocks, plus the optional message that rides along in
 * the "meeting scheduled" email. Used by the web server action today; shaped
 * so a mobile `/api/meetings/[id]/schedule` route can reuse it unchanged.
 */

export const SCHEDULE_MESSAGE_MAX = 500;

/** One 15-minute block on one day, as the `scheduled_meetings` table stores it. */
export const scheduleBlockSchema = z.object({
	/** Local midnight of the block's day. */
	scheduledDate: z.coerce.date(),
	scheduledFromTime: z
		.string()
		.regex(HOUR_MINUTE_SECOND_REGEX, "Expected a time in HH:MM:SS"),
	scheduledToTime: z
		.string()
		.regex(HOUR_MINUTE_SECOND_REGEX, "Expected a time in HH:MM:SS"),
});

export type ScheduleBlock = z.infer<typeof scheduleBlockSchema>;

export const saveMeetingScheduleSchema = z.object({
	meetingId: z.string().uuid(),
	adds: z.array(scheduleBlockSchema),
	removals: z.array(scheduleBlockSchema),
	/** Host's note for the email. Blank means "no message". */
	message: z
		.string()
		.trim()
		.max(SCHEDULE_MESSAGE_MAX)
		.optional()
		.transform((m) => (m ? m : undefined)),
});

export type SaveMeetingScheduleInput = z.input<
	typeof saveMeetingScheduleSchema
>;
export type SaveMeetingScheduleData = z.output<
	typeof saveMeetingScheduleSchema
>;

export type SaveMeetingScheduleResponse =
	| { success: true; notified: boolean }
	| { error: string };

export type MessageSegment = { kind: "text" | "link"; value: string };

/**
 * Splits a free-text message into plain-text and link pieces, so the modal can
 * preview links and the email can turn them into `<a>` tags. Only `http(s)://`
 * links count; trailing sentence punctuation (`.,)!?`) stays in the text.
 *
 * splitMessageLinks("Join https://meet.google.com/abc.")
 *   → [{ kind: "text", value: "Join " },
 *      { kind: "link", value: "https://meet.google.com/abc" },
 *      { kind: "text", value: "." }]
 */
export function splitMessageLinks(text: string): MessageSegment[] {
	// TODO(human): G1 — replace this stub so the tests in schedule.test.ts pass.
	// Hints:
	//   1. A regex like /https?:\/\/\S+/g plus `text.matchAll(regex)` gives each
	//      match and its `.index`.
	//   2. Keep a `cursor` (where the last match ended). The text between the
	//      cursor and `match.index` is a "text" segment.
	//   3. Peel trailing . , ) ! ? off the matched link (a while-loop or a
	//      /[.,)!?]+$/ regex) and give them back to the following text.
	//   4. Don't emit empty "text" segments. Whatever is left after the last
	//      match is the final "text" segment.
	return text ? [{ kind: "text", value: text }] : [];
}

const VIDEO_HOSTS =
	/^(meet\.google\.com|([a-z0-9-]+\.)?zoom\.us|teams\.microsoft\.com)$/i;

/**
 * The first link that points at a video call (Meet, Zoom, Teams). Parsed with a
 * regex rather than `new URL()` because Hermes' `URL` lacks `hostname`.
 */
export function firstVideoLink(segments: MessageSegment[]): string | null {
	for (const segment of segments) {
		if (segment.kind !== "link") continue;
		const host = /^https?:\/\/([^/?#:]+)/i.exec(segment.value)?.[1];
		if (host && VIDEO_HOSTS.test(host)) return segment.value;
	}
	return null;
}
