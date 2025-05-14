"use server";

import {
    validateGoogleAccessToken,
    type ValidateGoogleAccessTokenError,
} from "@/lib/auth/google";
import { GoogleCalendarEvent } from "@/lib/types/availability";
import { google as googleClient } from "googleapis";

export async function fetchGoogleCalendarEvents(
    startDate: string,
    endDate: string
): Promise<GoogleCalendarEvent[]> {
    const {
        accessToken,
        error,
    }: {
        accessToken: string | null;
        error: ValidateGoogleAccessTokenError | null;
    } = await validateGoogleAccessToken();

    if (error === "No Google refresh token" || error === "Not authenticated") {
        return [];
    }

    if (error || !accessToken) {
        throw new Error(error ?? "Could not retrieve Google access token");
    }

    const auth = new googleClient.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const calendar = googleClient.calendar({ version: "v3", auth });

    try {
        const calendarListRes = await calendar.calendarList.list();
        const calendarItems = calendarListRes.data.items ?? [];

        const eventsPerCalendar = await Promise.all(
            calendarItems.map(async (cal) => {
                if (!cal.id) {
                    return [];
                } // Skip if calendar ID is missing

                const calendarColor = cal.backgroundColor ?? "#039BE5"; // Fallback color

                try {
                    const eventsRes = await calendar.events.list({
                        calendarId: cal.id!,
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
                        calendarId: cal.id!,
                    }));
                } catch (e) {
                    console.warn(
                        `Failed to fetch events for calendar ${cal.id}`,
                        e
                    );
                    return [];
                }
            })
        );

        return eventsPerCalendar.flat();
    } catch (e) {
        console.error("Failed to fetch Google Calendar list", e);

        return [];
    }
}
