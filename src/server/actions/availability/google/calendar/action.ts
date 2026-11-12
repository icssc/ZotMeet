"use server";

import { getExistingMeeting } from "@data/meeting/queries";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { availabilities } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { validateGoogleAccessToken } from "@/lib/auth/google";
import {
	addOrUpdateMeetingGoogleCalendarEvent,
	buildCalendarClient,
	type CalendarWorkerResult,
	loadMergedScheduledIntervalFor,
} from "@/lib/google-calendar/sync";
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

	const calendar = buildCalendarClient(accessToken);

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
						calendarName: cal.summary ?? cal.id ?? "Unknown Calendar",
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

export async function addMeetingToMyGoogleCalendar({
	meetingId,
}: {
	meetingId: string;
}): Promise<
	| { success: true; result: CalendarWorkerResult }
	| { success: false; error: string }
> {
	const { user } = await getCurrentSession();
	if (!user) {
		return { success: false, error: "Not authenticated" };
	}

	const tokenResult = await validateGoogleAccessToken();
	if (tokenResult.error || !tokenResult.accessToken) {
		return {
			success: false,
			error: tokenResult.error ?? "Could not obtain Google access token",
		};
	}

	let meeting: Awaited<ReturnType<typeof getExistingMeeting>>;
	try {
		meeting = await getExistingMeeting(meetingId);
	} catch {
		return { success: false, error: "Meeting not found" };
	}

	if (meeting.hostId !== user.memberId) {
		const [response] = await db
			.select({ memberId: availabilities.memberId })
			.from(availabilities)
			.where(
				and(
					eq(availabilities.meetingId, meetingId),
					eq(availabilities.memberId, user.memberId),
				),
			)
			.limit(1);

		if (!response) {
			return {
				success: false,
				error:
					"You must respond to this meeting before adding it to your calendar",
			};
		}
	}

	const interval = await loadMergedScheduledIntervalFor(meeting);
	if (!interval) {
		return {
			success: true,
			result: { status: "failed", reason: "non_contiguous_schedule" },
		};
	}

	const result = await addOrUpdateMeetingGoogleCalendarEvent({
		meeting,
		interval,
		memberId: user.memberId,
		accessToken: tokenResult.accessToken,
	});

	return { success: true, result };
}
