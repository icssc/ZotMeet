"use server";

import {
	getExistingMeeting,
	getScheduledTimeBlocks,
} from "@data/meeting/queries";
import { fromZonedTime } from "date-fns-tz";
import {
	groupScheduledBlocksByDate,
	mergeContiguousTimeBlocks,
} from "@/lib/meetings/utils";
import {
	getCurrentWeekDateForAnchor,
	isAnchorDateMeeting,
} from "@/lib/types/chrono";

function combineDateAndTimeISO(date: Date, time: string): string {
	const [hours, minutes, seconds = "00"] = time.split(":");

	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");

	const hh = String(hours).padStart(2, "0");
	const min = String(minutes).padStart(2, "0");
	const ss = String(seconds).padStart(2, "0");

	return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
}

function formatOutlookDateTimeUTC(date: Date): string {
	// Outlook accepts ISO 8601. Use explicit UTC ("Z") to avoid local-tz interpretation.
	return date.toISOString().replace(".000Z", "Z");
}

export async function getOutlookCalendarLink({
	meetingId,
	meetingTitle,
	meetingDescription,
	meetingLocation,
}: {
	meetingId: string;
	meetingTitle: string;
	meetingDescription: string | null;
	meetingLocation: string | null;
}) {
	const blocks = await getScheduledTimeBlocks(meetingId);

	if (!blocks.length) {
		return {
			success: false,
			link: null,
		};
	}

	const meetingData = await getExistingMeeting(meetingId);
	const isDaysOfWeek = isAnchorDateMeeting(meetingData.dates);

	// Group by date, then merge each day's blocks independently
	const grouped = groupScheduledBlocksByDate(blocks);

	// Use the first day's merged interval for the Outlook event
	const firstDay = grouped[0];
	const mergedInterval = mergeContiguousTimeBlocks(firstDay.blocks);
	if (!mergedInterval) {
		return {
			success: false,
			link: null,
		};
	}

	const date = isDaysOfWeek
		? getCurrentWeekDateForAnchor(firstDay.date)
		: firstDay.date;

	const start = formatOutlookDateTimeUTC(
		fromZonedTime(
			combineDateAndTimeISO(date, mergedInterval.from),
			meetingData.timezone,
		),
	);
	const end = formatOutlookDateTimeUTC(
		fromZonedTime(
			combineDateAndTimeISO(date, mergedInterval.to),
			meetingData.timezone,
		),
	);

	const params = new URLSearchParams({
		rru: "addevent",
		path: "/calendar/action/compose",
		subject: meetingTitle,
		startdt: start,
		enddt: end,
		body: meetingDescription ?? "Meeting scheduled via ZotMeet.",
		location: meetingLocation ?? "",
	});

	const link = `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;

	return {
		success: true,
		link,
		totalDays: grouped.length,
	};
}
