"use server";

import { getScheduledTimeBlocks } from "@data/meeting/queries";
import { google as googleClient } from "googleapis";
import { validateGoogleAccessToken } from "@/lib/auth/google";
import { mergeContiguousTimeBlocks } from "@/lib/meetings/utils";
import type { GoogleCalendarEvent } from "@/lib/types/availability";

export async function fetchGoogleCalendarEvents(
	startDate: string,
	endDate: string,
): Promise<GoogleCalendarEvent[]> {
	const { accessToken, error } = await validateGoogleAccessToken();

	if (error === "No OAuth refresh token" || error === "Not authenticated") {
		return [];
	}

	if (error || !accessToken) {
		throw new Error(error ?? "Could not retrieve OAuth access token");
	}

	const auth = new googleClient.auth.OAuth2();
	auth.setCredentials({ access_token: accessToken });

	const calendar = googleClient.calendar({ version: "v3", auth });

	try {
		const calendarListRes = await calendar.calendarList.list();
		const calendarItems = calendarListRes.data.items ?? [];

		const eventsPerCalendar = await Promise.all(
			calendarItems.map(async (cal) => {
				// Skip if calendar ID is missing
				if (!cal.id) {
					return [];
				}

				const calendarColor = cal.backgroundColor ?? "#039BE5"; // Fallback color
				const calendarName = cal.summary ?? cal.id;

				try {
					const eventsRes = await calendar.events.list({
						calendarId: cal.id,
						timeMin: startDate,
						timeMax: endDate,
						// TODO: Consider if we need to cap results. If we do, pass non-blocking error to alert user.
						maxResults: 250,
						singleEvents: true,
						orderBy: "startTime",
					});

					return (eventsRes.data.items ?? []).map((e) => ({
						id: e.id ?? `gcal-${Date.now()}-${Math.random()}`,
						summary: e.summary ?? "Unnamed event",
						start: e.start?.dateTime ?? e.start?.date ?? "",
						end: e.end?.dateTime ?? e.end?.date ?? "",
						calendarColor,
						calendarId: cal.id,
						calendarName,
					}));
				} catch (e) {
					console.warn(`Failed to fetch events for calendar ${cal.id}`, e);
					return [];
				}
			}),
		);

		return eventsPerCalendar.flat();
	} catch (e) {
		console.error("Failed to fetch Google Calendar list", e);

		return [];
	}
}

// helper for adding to google calendar
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

export async function getGoogleCalendarPrefilledLink({
	meetingId,
	meetingTitle,
	meetingDescription,
	meetingLocation,
	timezone,
}: {
	meetingId: string;
	meetingTitle: string;
	meetingDescription: string | null;
	meetingLocation: string | null;
	timezone: string;
}) {
	const blocks = await getScheduledTimeBlocks(meetingId);

	if (!blocks.length) {
		return {
			success: false,
			link: null,
		};
	}

	// merge all 15-min blocks into 1 contiguous interval
	const mergedInterval = mergeContiguousTimeBlocks(blocks);
	if (!mergedInterval) {
		return {
			success: false,
			link: null,
		};
	}

	// all blocks are now on the same date
	const date = blocks[0].scheduledDate;

	const start = combineDateAndTime(date, mergedInterval.from);
	const end = combineDateAndTime(date, mergedInterval.to);

	const params = new URLSearchParams({
		action: "TEMPLATE",
		text: meetingTitle,
		dates: `${start}/${end}`,
		details: meetingDescription ?? "Meeting scheduled via ZotMeet.",
		location: meetingLocation ?? "",
		ctz: timezone,
	});

	const link = `https://calendar.google.com/calendar/render?${params.toString()}`;

	return {
		success: true,
		link,
	};
}
