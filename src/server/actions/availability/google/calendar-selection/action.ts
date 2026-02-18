"use server";

import { and, eq } from "drizzle-orm";
import type { calendar_v3 } from "googleapis";
import { google as googleClient } from "googleapis";
import { db } from "@/db";
import type { SelectUserGoogleCalendar } from "@/db/schema";
import { userGoogleCalendars } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { validateGoogleAccessToken } from "@/lib/auth/google";

export async function syncUserCalendars(
	userId: string,
	googleCalendars: calendar_v3.Schema$CalendarListEntry[],
): Promise<void> {
	const googleCalendarIds = new Set(
		googleCalendars.filter((c) => c.id).map((c) => c.id!),
	);

	const existingCalendars = await db
		.select()
		.from(userGoogleCalendars)
		.where(eq(userGoogleCalendars.userId, userId));

	for (const existing of existingCalendars) {
		if (!googleCalendarIds.has(existing.calendarId)) {
			await db
				.update(userGoogleCalendars)
				.set({ archived: true, updatedAt: new Date() })
				.where(
					and(
						eq(userGoogleCalendars.userId, userId),
						eq(userGoogleCalendars.calendarId, existing.calendarId),
					),
				);
		}
	}

	for (const gcal of googleCalendars) {
		if (!gcal.id) continue;

		await db
			.insert(userGoogleCalendars)
			.values({
				userId,
				calendarId: gcal.id,
				enabled: true,
				archived: false,
			})
			.onConflictDoUpdate({
				target: [userGoogleCalendars.userId, userGoogleCalendars.calendarId],
				set: {
					archived: false,
					updatedAt: new Date(),
				},
			});
	}
}

export async function getUserEnabledCalendars(
	userId: string,
): Promise<SelectUserGoogleCalendar[]> {
	const calendars = await db
		.select()
		.from(userGoogleCalendars)
		.where(
			and(
				eq(userGoogleCalendars.userId, userId),
				eq(userGoogleCalendars.enabled, true),
				eq(userGoogleCalendars.archived, false),
			),
		);

	return calendars;
}

export async function getUserCalendars(
	userId: string,
): Promise<SelectUserGoogleCalendar[]> {
	const calendars = await db
		.select()
		.from(userGoogleCalendars)
		.where(eq(userGoogleCalendars.userId, userId));

	return calendars;
}

export async function getCalendarsForDialog(): Promise<
	Array<{
		calendarId: string;
		calendarName: string;
		calendarColor: string;
		enabled: boolean;
		archived: boolean;
	}>
> {
	const { user } = await getCurrentSession();
	if (!user) {
		return [];
	}

	const { accessToken, error } = await validateGoogleAccessToken();

	if (error || !accessToken) {
		const dbCalendars = await getUserCalendars(user.id);
		return dbCalendars.map((c) => ({
			calendarId: c.calendarId,
			calendarName: c.calendarId,
			calendarColor: "#039BE5",
			enabled: c.enabled,
			archived: c.archived,
		}));
	}

	try {
		const auth = new googleClient.auth.OAuth2();
		auth.setCredentials({ access_token: accessToken });
		const calendar = googleClient.calendar({ version: "v3", auth });
		const calendarListRes = await calendar.calendarList.list();
		const calendarItems = calendarListRes.data.items ?? [];

		await syncUserCalendars(user.id, calendarItems);

		const dbCalendars = await getUserCalendars(user.id);

		const googleMap = new Map<string, calendar_v3.Schema$CalendarListEntry>();
		for (const c of calendarItems) {
			if (c.id) googleMap.set(c.id, c);
		}

		return dbCalendars.map((dbCal) => {
			const gcal = googleMap.get(dbCal.calendarId);
			return {
				calendarId: dbCal.calendarId,
				calendarName: gcal?.summary ?? dbCal.calendarId,
				calendarColor: gcal?.backgroundColor ?? "#039BE5",
				enabled: dbCal.enabled,
				archived: dbCal.archived,
			};
		});
	} catch (e) {
		console.error("Failed to fetch Google Calendar list", e);
		const dbCalendars = await getUserCalendars(user.id);
		return dbCalendars.map((c) => ({
			calendarId: c.calendarId,
			calendarName: c.calendarId,
			calendarColor: "#039BE5",
			enabled: c.enabled,
			archived: c.archived,
		}));
	}
}

export async function batchUpdateCalendarSelections(
	updates: Array<{ calendarId: string; enabled: boolean }>,
): Promise<{ success: boolean; error?: string }> {
	try {
		const { user } = await getCurrentSession();

		if (!user) {
			return { success: false, error: "User not authenticated" };
		}

		for (const update of updates) {
			await db
				.update(userGoogleCalendars)
				.set({
					enabled: update.enabled,
					updatedAt: new Date(),
				})
				.where(
					and(
						eq(userGoogleCalendars.userId, user.id),
						eq(userGoogleCalendars.calendarId, update.calendarId),
					),
				);
		}

		return { success: true };
	} catch (error) {
		console.error("Error updating calendar selections:", error);
		return { success: false, error: "Failed to update calendar selections" };
	}
}
