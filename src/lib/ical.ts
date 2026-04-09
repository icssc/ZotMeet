import { fromZonedTime } from "date-fns-tz";
import type { SelectMeeting, SelectScheduledMeeting } from "@/db/schema";
import {
	getCurrentWeekDateForAnchor,
	isAnchorDateMeeting,
} from "@/lib/types/chrono";

function formatICalDateTimeUTC(date: Date): string {
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	const day = String(date.getUTCDate()).padStart(2, "0");
	const hours = String(date.getUTCHours()).padStart(2, "0");
	const minutes = String(date.getUTCMinutes()).padStart(2, "0");
	const seconds = String(date.getUTCSeconds()).padStart(2, "0");
	return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function escapeICalText(text: string): string {
	return text
		.replace(/\\/g, "\\\\")
		.replace(/;/g, "\\;")
		.replace(/,/g, "\\,")
		.replace(/\n/g, "\\n");
}

interface TimeInterval {
	date: Date;
	from: string; // "HH:mm:ss"
	to: string; // "HH:mm:ss"
}

function mergeScheduledBlocks(
	blocks: SelectScheduledMeeting[],
): TimeInterval[] {
	if (blocks.length === 0) return [];

	const byDate = new Map<string, SelectScheduledMeeting[]>();
	for (const block of blocks) {
		const key = block.scheduledDate.toISOString().split("T")[0];
		if (!byDate.has(key)) byDate.set(key, []);
		const dateBlocks = byDate.get(key);
		if (dateBlocks) dateBlocks.push(block);
	}

	const intervals: TimeInterval[] = [];

	for (const [, dateBlocks] of byDate) {
		const sorted = [...dateBlocks].sort((a, b) =>
			a.scheduledFromTime.localeCompare(b.scheduledFromTime),
		);

		let currentFrom = sorted[0].scheduledFromTime;
		let currentTo = sorted[0].scheduledToTime;
		const date = sorted[0].scheduledDate;

		for (let i = 1; i < sorted.length; i++) {
			if (sorted[i].scheduledFromTime === currentTo) {
				currentTo = sorted[i].scheduledToTime;
			} else {
				intervals.push({ date, from: currentFrom, to: currentTo });
				currentFrom = sorted[i].scheduledFromTime;
				currentTo = sorted[i].scheduledToTime;
			}
		}
		intervals.push({ date, from: currentFrom, to: currentTo });
	}

	return intervals;
}

// Helper function to pad a number to 2 digits
function pad2(n: number): string {
	return String(n).padStart(2, "0");
}

function getYmd(date: Date): { yyyy: number; mm: string; dd: string } {
	return {
		yyyy: date.getFullYear(),
		mm: pad2(date.getMonth() + 1),
		dd: pad2(date.getDate()),
	};
}

function zonedLocalDateTimeToUTCDate(
	date: Date,
	time: string,
	timezone: string,
): Date {
	const [h, m, s = "00"] = time.split(":");
	const { yyyy, mm, dd } = getYmd(date);
	return fromZonedTime(`${yyyy}-${mm}-${dd}T${h}:${m}:${s}`, timezone);
}

export function generateICalString(
	meetingData: SelectMeeting,
	scheduledBlocks: SelectScheduledMeeting[] = [],
): string | null {
	if (scheduledBlocks.length === 0) {
		return null;
	}

	const lines: string[] = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//ZotMeet//ZotMeet//EN",
		"CALSCALE:GREGORIAN",
		"METHOD:PUBLISH",
	];

	const title = escapeICalText(meetingData.title);
	const description = meetingData.description
		? escapeICalText(meetingData.description)
		: "";
	const location = meetingData.location
		? escapeICalText(meetingData.location)
		: "";

	const now = formatICalDateTimeUTC(new Date());
	const isDaysOfWeek = isAnchorDateMeeting(meetingData.dates);
	const intervals = mergeScheduledBlocks(scheduledBlocks);

	for (let i = 0; i < intervals.length; i++) {
		const interval = intervals[i];

		const eventDate = isDaysOfWeek
			? getCurrentWeekDateForAnchor(interval.date)
			: interval.date;

		const startDate = zonedLocalDateTimeToUTCDate(
			eventDate,
			interval.from,
			meetingData.timezone,
		);
		const endDate = zonedLocalDateTimeToUTCDate(
			eventDate,
			interval.to,
			meetingData.timezone,
		);

		const { yyyy, mm, dd } = getYmd(eventDate);
		const datePart = `${yyyy}-${mm}-${dd}`;
		const uid = `${meetingData.id}-scheduled-${datePart}-${i}@zotmeet`;

		lines.push("BEGIN:VEVENT");
		lines.push(`UID:${uid}`);
		lines.push(`DTSTAMP:${now}`);
		lines.push(`DTSTART:${formatICalDateTimeUTC(startDate)}`);
		lines.push(`DTEND:${formatICalDateTimeUTC(endDate)}`);
		lines.push(`SUMMARY:${title}`);
		if (description) {
			lines.push(`DESCRIPTION:${description}`);
		}
		if (location) {
			lines.push(`LOCATION:${location}`);
		}
		lines.push("END:VEVENT");
	}

	lines.push("END:VCALENDAR");
	return lines.join("\r\n");
}

export function triggerICalDownload(content: string, filename: string): void {
	const blob = new Blob([content], {
		type: "text/calendar;charset=utf-8",
	});
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();

	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
