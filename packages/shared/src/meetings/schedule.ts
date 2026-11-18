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

export type ScheduleNotificationKind = "scheduled" | "rescheduled";

export function scheduleNotificationKind({
	wasScheduled,
	hasChanges,
	hasBlocksAfter,
}: {
	wasScheduled: boolean;
	hasChanges: boolean;
	hasBlocksAfter: boolean;
}): ScheduleNotificationKind | null {
	if (!hasChanges || !hasBlocksAfter) return null;
	return wasScheduled ? "rescheduled" : "scheduled";
}

export type SaveMeetingScheduleResponse =
	| { success: true; kind: ScheduleNotificationKind | null }
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
	const segments: MessageSegment[] = [];
	let pendingText = "";
	let cursor = 0;

	for (const match of text.matchAll(/https?:\/\/\S+/g)) {
		const start = match.index ?? 0;
		const trailing = /[.,)!?]+$/.exec(match[0])?.[0] ?? "";
		const link = match[0].slice(0, match[0].length - trailing.length);

		pendingText += text.slice(cursor, start);
		cursor = start + match[0].length;

		// "https://." peels down to just the scheme: not a real link.
		if (/^https?:\/\/$/.test(link)) {
			pendingText += match[0];
			continue;
		}

		if (pendingText) segments.push({ kind: "text", value: pendingText });
		segments.push({ kind: "link", value: link });
		pendingText = trailing;
	}

	pendingText += text.slice(cursor);
	if (pendingText) segments.push({ kind: "text", value: pendingText });
	return segments;
}
