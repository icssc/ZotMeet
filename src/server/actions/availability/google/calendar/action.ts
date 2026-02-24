"use server";

import { getScheduledTimeBlocks } from "@data/meeting/queries";
import { google as googleClient } from "googleapis";
import { validateGoogleAccessToken } from "@/lib/auth/google";
import {
	groupScheduledBlocksByDate,
	mergeContiguousTimeBlocks,
} from "@/lib/meetings/utils";
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
function combineDateAndTime(date: Date, time: string) {
	const [hours, minutes, seconds] = time.split(":").map(Number);

	const combined = new Date(date);
	combined.setHours(hours, minutes, seconds || 0, 0);

	return combined.toISOString();
}

export async function getGoogleCalendarPrefilledLinks({
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

	const links: Array<string> = [];

	const blocksByDate = groupScheduledBlocksByDate(blocks);

	for (const { date, blocks } of blocksByDate) {
		const mergedIntervals = mergeContiguousTimeBlocks(blocks);

		for (const interval of mergedIntervals) {
			// Format start and end date to be in the format required by gcal (remove -, :, and .000)
			const start = combineDateAndTime(date, interval.from).replace(
				/([-:]|\.000)/g,
				"",
			);
			const end = combineDateAndTime(date, interval.to).replace(
				/([-:]|\.000)/g,
				"",
			);

			const params = new URLSearchParams({
				action: "TEMPLATE",
				text: `${meetingTitle}`,
				dates: `${start}/${end}`,
				details: meetingDescription ?? "Meeting scheduled via ZotMeet.",
				location: meetingLocation ?? "",
				ctz: timezone,
			});

			const url = `https://calendar.google.com/calendar/render?${params.toString()}`;

			links.push(url);
		}
	}

	return {
		success: true,
		links,
	};
}
