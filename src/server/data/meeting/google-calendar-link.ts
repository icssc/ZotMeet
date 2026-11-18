import "server-only";

import { mergeContiguousTimeBlocks } from "@/lib/meetings/utils";
import { getScheduledTimeBlocks } from "@/server/data/meeting/queries";

function combineDateAndTime(date: Date, time: string): string {
	const [hours, minutes, seconds = "00"] = time.split(":");

	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0"); // 1-indexed months for gcal
	const dd = String(date.getDate()).padStart(2, "0");

	const hh = String(hours).padStart(2, "0");
	const min = String(minutes).padStart(2, "0");
	const ss = String(seconds).padStart(2, "0");

	return `${yyyy}${mm}${dd}T${hh}${min}${ss}`;
}

/**
 * A prefilled "Add to Google Calendar" URL for a scheduled meeting, or `null`
 * when it has no scheduled blocks. Used by the web button
 * (`getGoogleCalendarPrefilledLink`) and the "meeting scheduled" email.
 */
export async function buildGoogleCalendarLink(meeting: {
	id: string;
	title: string;
	description: string | null;
	location: string | null;
	timezone: string;
}): Promise<string | null> {
	const blocks = await getScheduledTimeBlocks(meeting.id);
	if (!blocks.length) return null;

	// merge all 15-min blocks into 1 contiguous interval
	const mergedInterval = mergeContiguousTimeBlocks(blocks);
	if (!mergedInterval) return null;

	// all blocks are now on the same date
	const date = blocks[0].scheduledDate;

	const start = combineDateAndTime(date, mergedInterval.from);
	const end = combineDateAndTime(date, mergedInterval.to);

	const params = new URLSearchParams({
		action: "TEMPLATE",
		text: meeting.title,
		dates: `${start}/${end}`,
		details: meeting.description ?? "Meeting scheduled via ZotMeet.",
		location: meeting.location ?? "",
		ctz: meeting.timezone,
	});

	return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
