"use server";

import { createHash } from "node:crypto";
import {
	getExistingMeeting,
	getScheduledTimeBlocks,
} from "@data/meeting/queries";
import { and, eq, gt, inArray, isNotNull } from "drizzle-orm";
import {
	type Auth,
	type calendar_v3,
	google as googleClient,
} from "googleapis";
import { db } from "@/db";
import {
	availabilities,
	type MeetingGoogleCalendarSnapshot,
	meetingGoogleCalendarEvents,
	members,
	sessions,
	users,
} from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import {
	getGoogleAccessTokenForUser,
	validateGoogleAccessToken,
} from "@/lib/auth/google";
import { mergeContiguousTimeBlocks } from "@/lib/meetings/utils";
import type { GoogleCalendarEvent } from "@/lib/types/availability";

const PRIMARY_CALENDAR_ID = "primary";
const FANOUT_CONCURRENCY = 5;

const BASE32HEX_ALPHABET = "0123456789abcdefghijklmnopqrstuv";

function deterministicEventId(meetingId: string, memberId: string): string {
	const digest = createHash("sha256")
		.update(`${meetingId}:${memberId}`)
		.digest();
	let id = "";
	for (let i = 0; i < 32; i++) {
		id += BASE32HEX_ALPHABET[digest[i] & 0x1f];
	}
	return id;
}

function googleErrorCode(error: unknown): number | undefined {
	if (typeof error !== "object" || error === null) return undefined;
	const e = error as { code?: number; status?: number };
	return typeof e.code === "number" ? e.code : e.status;
}

function isGoogleNotFound(error: unknown): boolean {
	const code = googleErrorCode(error);
	return code === 404 || code === 410;
}

function isGoogleConflict(error: unknown): boolean {
	return googleErrorCode(error) === 409;
}

function isRetryableGoogleError(error: unknown): boolean {
	const code = googleErrorCode(error);
	if (code === undefined) return false;
	if (code >= 500 && code < 600) return true;
	if (code === 403) {
		// Google distinguishes "rateLimitExceeded" / "userRateLimitExceeded"
		// (retryable) from quota / auth 403s (not retryable). Without the
		// reason field we'd retry every 403, so dig it out.
		const reason = (
			error as {
				errors?: Array<{ reason?: string }>;
			}
		).errors?.[0]?.reason;
		return reason === "rateLimitExceeded" || reason === "userRateLimitExceeded";
	}
	return false;
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
	let lastErr: unknown;
	for (let i = 0; i < attempts; i++) {
		try {
			return await fn();
		} catch (err) {
			lastErr = err;
			if (i === attempts - 1 || !isRetryableGoogleError(err)) {
				throw err;
			}
			const base = 250 * 2 ** i;
			const jitter = Math.random() * base;
			await new Promise((resolve) => setTimeout(resolve, base + jitter));
		}
	}
	throw lastErr;
}

async function runBounded<T, R>(
	items: T[],
	limit: number,
	worker: (item: T) => Promise<R>,
): Promise<R[]> {
	const results: R[] = Array.from({ length: items.length });
	let cursor = 0;
	const runners = Array.from(
		{ length: Math.min(limit, items.length) },
		async () => {
			while (true) {
				const i = cursor++;
				if (i >= items.length) return;
				results[i] = await worker(items[i]);
			}
		},
	);
	await Promise.all(runners);
	return results;
}

function meetingDeepLink(meetingId: string): string {
	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL?.trim() || "http://localhost:3000";
	return `${baseUrl}/availability/${meetingId}`;
}

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

function buildCalendarClient(accessToken: string): calendar_v3.Calendar {
	const auth: Auth.OAuth2Client = new googleClient.auth.OAuth2();
	auth.setCredentials({ access_token: accessToken });

	return googleClient.calendar({ version: "v3", auth });
}

export async function loadMergedScheduledInterval(
	meetingId: string,
): Promise<MeetingGoogleCalendarSnapshot | null> {
	const blocks = await getScheduledTimeBlocks(meetingId);

	if (!blocks.length) {
		return null;
	}

	const merged = mergeContiguousTimeBlocks(blocks);
	if (!merged) {
		return null;
	}

	return {
		date: blocks[0].scheduledDate.toISOString().slice(0, 10),
		fromTime: merged.from,
		toTime: merged.to,
	};
}

export type CalendarWorkerResult =
	| { status: "synced"; eventId: string }
	| { status: "skipped"; reason: string }
	| { status: "failed"; reason: string };

async function buildEventRequestBody(
	meetingId: string,
	memberId: string,
	interval: MeetingGoogleCalendarSnapshot,
): Promise<calendar_v3.Schema$Event> {
	const meeting = await getExistingMeeting(meetingId);

	return {
		summary: meeting.title,
		description: meeting.description ?? "Meeting scheduled via ZotMeet.",
		location: meeting.location ?? undefined,
		start: {
			dateTime: `${interval.date}T${interval.fromTime}`,
			timeZone: meeting.timezone,
		},
		end: {
			dateTime: `${interval.date}T${interval.toTime}`,
			timeZone: meeting.timezone,
		},
		extendedProperties: {
			private: {
				zotmeetMeetingId: meetingId,
				zotmeetMemberId: memberId,
			},
		},
		source: {
			title: "ZotMeet",
			url: meetingDeepLink(meetingId),
		},
	};
}

async function deleteTrackingRow(
	meetingId: string,
	memberId: string,
): Promise<void> {
	await db
		.delete(meetingGoogleCalendarEvents)
		.where(
			and(
				eq(meetingGoogleCalendarEvents.meetingId, meetingId),
				eq(meetingGoogleCalendarEvents.memberId, memberId),
			),
		);
}

async function upsertTrackingRow({
	meetingId,
	memberId,
	googleCalendarId,
	googleEventId,
	lastSyncedSnapshot,
}: {
	meetingId: string;
	memberId: string;
	googleCalendarId: string;
	googleEventId: string;
	lastSyncedSnapshot: MeetingGoogleCalendarSnapshot;
}): Promise<void> {
	const updatedAt = new Date();
	await db
		.insert(meetingGoogleCalendarEvents)
		.values({
			meetingId,
			memberId,
			googleCalendarId,
			googleEventId,
			lastSyncedSnapshot,
			updatedAt,
		})
		.onConflictDoUpdate({
			target: [
				meetingGoogleCalendarEvents.meetingId,
				meetingGoogleCalendarEvents.memberId,
			],
			set: {
				googleCalendarId,
				googleEventId,
				lastSyncedSnapshot,
				updatedAt,
			},
		});
}

export async function addOrUpdateMeetingGoogleCalendarEvent({
	meetingId,
	memberId,
	accessToken,
}: {
	meetingId: string;
	memberId: string;
	accessToken: string;
}): Promise<CalendarWorkerResult> {
	const interval = await loadMergedScheduledInterval(meetingId);
	if (!interval) {
		return { status: "failed", reason: "non_contiguous_schedule" };
	}

	const calendar = buildCalendarClient(accessToken);
	const requestBody = await buildEventRequestBody(
		meetingId,
		memberId,
		interval,
	);
	const desiredEventId = deterministicEventId(meetingId, memberId);

	const existing = await db
		.select()
		.from(meetingGoogleCalendarEvents)
		.where(
			and(
				eq(meetingGoogleCalendarEvents.meetingId, meetingId),
				eq(meetingGoogleCalendarEvents.memberId, memberId),
			),
		)
		.limit(1);

	let eventId: string | null = null;
	let calendarId = PRIMARY_CALENDAR_ID;

	if (existing.length > 0) {
		const row = existing[0];
		calendarId = row.googleCalendarId;
		try {
			const patched = await withRetry(() =>
				calendar.events.patch({
					calendarId,
					eventId: row.googleEventId,
					requestBody,
					sendUpdates: "none",
				}),
			);
			eventId = patched.data.id ?? row.googleEventId;
		} catch (err) {
			if (!isGoogleNotFound(err)) {
				console.error("events.patch failed", { meetingId, memberId, err });
				return { status: "failed", reason: "google_patch_failed" };
			}
			await deleteTrackingRow(meetingId, memberId);
			calendarId = PRIMARY_CALENDAR_ID;
		}
	}

	if (eventId === null) {
		try {
			const inserted = await withRetry(() =>
				calendar.events.insert({
					calendarId: PRIMARY_CALENDAR_ID,
					sendUpdates: "none",
					requestBody: { ...requestBody, id: desiredEventId },
				}),
			);
			eventId = inserted.data.id ?? desiredEventId;
			calendarId = PRIMARY_CALENDAR_ID;
		} catch (err) {
			if (!isGoogleConflict(err)) {
				console.error("events.insert failed", { meetingId, memberId, err });
				return { status: "failed", reason: "google_insert_failed" };
			}

			try {
				const fetched = await withRetry(() =>
					calendar.events.get({
						calendarId: PRIMARY_CALENDAR_ID,
						eventId: desiredEventId,
					}),
				);
				eventId = fetched.data.id ?? desiredEventId;
				calendarId = PRIMARY_CALENDAR_ID;
			} catch (getErr) {
				console.error("events.get after 409 failed", {
					meetingId,
					memberId,
					getErr,
				});
				return { status: "failed", reason: "google_recover_failed" };
			}
		}
	}

	await upsertTrackingRow({
		meetingId,
		memberId,
		googleCalendarId: calendarId,
		googleEventId: eventId,
		lastSyncedSnapshot: interval,
	});

	return { status: "synced", eventId };
}

export async function removeMeetingGoogleCalendarEvent({
	meetingId,
	memberId,
	accessToken,
}: {
	meetingId: string;
	memberId: string;
	accessToken: string;
}): Promise<{ status: "removed" | "no_row" | "failed"; reason?: string }> {
	const existing = await db
		.select()
		.from(meetingGoogleCalendarEvents)
		.where(
			and(
				eq(meetingGoogleCalendarEvents.meetingId, meetingId),
				eq(meetingGoogleCalendarEvents.memberId, memberId),
			),
		)
		.limit(1);

	if (existing.length === 0) {
		return { status: "no_row" };
	}

	const row = existing[0];
	const calendar = buildCalendarClient(accessToken);

	try {
		await withRetry(() =>
			calendar.events.delete({
				calendarId: row.googleCalendarId,
				eventId: row.googleEventId,
				sendUpdates: "none",
			}),
		);
	} catch (err) {
		if (!isGoogleNotFound(err)) {
			console.error("events.delete failed", { meetingId, memberId, err });
		}
	}

	await deleteTrackingRow(meetingId, memberId);

	return { status: "removed" };
}

export type FanOutOutcome = {
	synced: number;
	skipped: number;
	failed: number;
	errors: Array<{ memberId: string; reason: string }>;
};

function emptyOutcome(): FanOutOutcome {
	return { synced: 0, skipped: 0, failed: 0, errors: [] };
}

type FanOutEntry = {
	status: "synced" | "skipped" | "failed";
	memberId: string;
	reason?: string;
};

function tallyOutcome(entries: FanOutEntry[]): FanOutOutcome {
	const outcome = emptyOutcome();
	for (const entry of entries) {
		if (entry.status === "synced") {
			outcome.synced += 1;
		} else if (entry.status === "skipped") {
			outcome.skipped += 1;
			if (entry.reason) {
				outcome.errors.push({ memberId: entry.memberId, reason: entry.reason });
			}
		} else {
			outcome.failed += 1;
			if (entry.reason) {
				outcome.errors.push({ memberId: entry.memberId, reason: entry.reason });
			}
		}
	}
	return outcome;
}

export async function syncMeetingToAllMemberCalendars(
	meetingId: string,
): Promise<FanOutOutcome> {
	const interval = await loadMergedScheduledInterval(meetingId);
	if (!interval) {
		return {
			synced: 0,
			skipped: 0,
			failed: 1,
			errors: [{ memberId: "*", reason: "non_contiguous_or_empty_schedule" }],
		};
	}

	const respondingMemberIds = (
		await db
			.select({ memberId: availabilities.memberId })
			.from(availabilities)
			.where(eq(availabilities.meetingId, meetingId))
	).map((row) => row.memberId);

	if (respondingMemberIds.length === 0) {
		return emptyOutcome();
	}

	const eligibleRows = await db
		.selectDistinct({
			memberId: members.id,
			userId: users.id,
		})
		.from(members)
		.innerJoin(users, eq(users.memberId, members.id))
		.innerJoin(
			sessions,
			and(
				eq(sessions.userId, users.id),
				gt(sessions.expiresAt, new Date()),
				isNotNull(sessions.oidcRefreshToken),
			),
		)
		.where(inArray(members.id, respondingMemberIds));

	const seen = new Set<string>();
	const eligible = eligibleRows.filter((row) => {
		if (seen.has(row.memberId)) return false;
		seen.add(row.memberId);
		return true;
	});

	const entries = await runBounded(
		eligible,
		FANOUT_CONCURRENCY,
		async (row) => {
			const tokenResult = await getGoogleAccessTokenForUser(row.userId);
			if (tokenResult.error || !tokenResult.accessToken) {
				return {
					status: "skipped" as const,
					memberId: row.memberId,
					reason: tokenResult.error ?? "no_access_token",
				};
			}

			const result = await addOrUpdateMeetingGoogleCalendarEvent({
				meetingId,
				memberId: row.memberId,
				accessToken: tokenResult.accessToken,
			});

			if (result.status === "synced") {
				return { status: "synced" as const, memberId: row.memberId };
			}
			return {
				status: result.status,
				memberId: row.memberId,
				reason: result.reason,
			};
		},
	);

	return tallyOutcome(entries);
}

export async function unsyncMeetingFromAllMemberCalendars(
	meetingId: string,
): Promise<FanOutOutcome> {
	const rows = await db
		.select({
			memberId: meetingGoogleCalendarEvents.memberId,
			userId: users.id,
		})
		.from(meetingGoogleCalendarEvents)
		.innerJoin(users, eq(users.memberId, meetingGoogleCalendarEvents.memberId))
		.where(eq(meetingGoogleCalendarEvents.meetingId, meetingId));

	if (rows.length === 0) {
		return emptyOutcome();
	}

	const entries = await runBounded(rows, FANOUT_CONCURRENCY, async (row) => {
		const tokenResult = await getGoogleAccessTokenForUser(row.userId);
		if (tokenResult.error || !tokenResult.accessToken) {
			await deleteTrackingRow(meetingId, row.memberId);
			return {
				status: "skipped" as const,
				memberId: row.memberId,
				reason: tokenResult.error ?? "no_access_token",
			};
		}

		const result = await removeMeetingGoogleCalendarEvent({
			meetingId,
			memberId: row.memberId,
			accessToken: tokenResult.accessToken,
		});

		if (result.status === "removed" || result.status === "no_row") {
			return { status: "synced" as const, memberId: row.memberId };
		}
		return {
			status: "failed" as const,
			memberId: row.memberId,
			reason: result.reason ?? "google_delete_failed",
		};
	});

	return tallyOutcome(entries);
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

	const result = await addOrUpdateMeetingGoogleCalendarEvent({
		meetingId,
		memberId: user.memberId,
		accessToken: tokenResult.accessToken,
	});

	return { success: true, result };
}
