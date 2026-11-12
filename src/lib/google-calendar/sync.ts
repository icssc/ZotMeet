import "server-only";

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
	type SelectMeeting,
	type SelectScheduledMeeting,
	sessions,
	users,
} from "@/db/schema";
import { getGoogleAccessTokenForUser } from "@/lib/auth/google";
import { INSUFFICIENT_SCOPE_REASON } from "@/lib/google-calendar/snapshot";
import {
	formatDateInTimezone,
	mergeContiguousTimeBlocks,
} from "@/lib/meetings/utils";

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

function isInsufficientScope(error: unknown): boolean {
	if (googleErrorCode(error) !== 403) return false;
	const e = error as { errors?: Array<{ reason?: string }>; message?: string };
	return (
		e.errors?.some((item) => item.reason === "insufficientPermissions") ===
			true || /insufficient authentication scopes/i.test(e.message ?? "")
	);
}

function isRetryableGoogleError(error: unknown): boolean {
	const code = googleErrorCode(error);
	if (code === undefined) return false;
	if (code >= 500 && code < 600) return true;
	if (code === 429) return true;
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

export function buildCalendarClient(accessToken: string): calendar_v3.Calendar {
	const auth: Auth.OAuth2Client = new googleClient.auth.OAuth2();
	auth.setCredentials({ access_token: accessToken });

	return googleClient.calendar({ version: "v3", auth });
}

export function computeMergedScheduledInterval(
	blocks: SelectScheduledMeeting[],
	timezone: string,
): MeetingGoogleCalendarSnapshot | null {
	if (!blocks.length) {
		return null;
	}

	const merged = mergeContiguousTimeBlocks(blocks, timezone);
	if (!merged) {
		return null;
	}

	return {
		date: formatDateInTimezone(blocks[0].scheduledDate, timezone),
		fromTime: merged.from,
		toTime: merged.to,
	};
}

export async function loadMergedScheduledIntervalFor(
	meeting: SelectMeeting,
): Promise<MeetingGoogleCalendarSnapshot | null> {
	const blocks = await getScheduledTimeBlocks(meeting.id);
	return computeMergedScheduledInterval(blocks, meeting.timezone);
}

export type CalendarWorkerResult =
	| { status: "synced"; eventId: string }
	| { status: "skipped"; reason: string }
	| { status: "failed"; reason: string };

function nextDay(isoDate: string): string {
	const d = new Date(`${isoDate}T00:00:00Z`);
	d.setUTCDate(d.getUTCDate() + 1);
	return d.toISOString().slice(0, 10);
}

function buildEventRequestBody(
	meeting: SelectMeeting,
	memberId: string,
	interval: MeetingGoogleCalendarSnapshot,
): calendar_v3.Schema$Event {
	const endDate =
		interval.toTime > interval.fromTime
			? interval.date
			: nextDay(interval.date);
	return {
		summary: meeting.title,
		description: meeting.description ?? "Meeting scheduled via ZotMeet.",
		location: meeting.location ?? undefined,
		start: {
			dateTime: `${interval.date}T${interval.fromTime}`,
			timeZone: meeting.timezone,
		},
		end: {
			dateTime: `${endDate}T${interval.toTime}`,
			timeZone: meeting.timezone,
		},
		extendedProperties: {
			private: {
				zotmeetMeetingId: meeting.id,
				zotmeetMemberId: memberId,
			},
		},
		source: {
			title: "ZotMeet",
			url: meetingDeepLink(meeting.id),
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
	meeting,
	interval,
	memberId,
	accessToken,
}: {
	meeting: SelectMeeting;
	interval: MeetingGoogleCalendarSnapshot;
	memberId: string;
	accessToken: string;
}): Promise<CalendarWorkerResult> {
	const meetingId = meeting.id;
	const calendar = buildCalendarClient(accessToken);
	const requestBody = buildEventRequestBody(meeting, memberId, interval);
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
			if (isInsufficientScope(err)) {
				return { status: "skipped", reason: INSUFFICIENT_SCOPE_REASON };
			}
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
			if (isInsufficientScope(err)) {
				return { status: "skipped", reason: INSUFFICIENT_SCOPE_REASON };
			}
			if (!isGoogleConflict(err)) {
				console.error("events.insert failed", { meetingId, memberId, err });
				return { status: "failed", reason: "google_insert_failed" };
			}

			try {
				const recovered = await withRetry(() =>
					calendar.events.patch({
						calendarId: PRIMARY_CALENDAR_ID,
						eventId: desiredEventId,
						requestBody: { ...requestBody, status: "confirmed" },
						sendUpdates: "none",
					}),
				);
				eventId = recovered.data.id ?? desiredEventId;
				calendarId = PRIMARY_CALENDAR_ID;
			} catch (getErr) {
				console.error("events.patch after 409 failed", {
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
			return { status: "failed", reason: "google_delete_failed" };
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
	const meeting = await getExistingMeeting(meetingId);
	const interval = await loadMergedScheduledIntervalFor(meeting);
	if (!interval) {
		const removal = await unsyncMeetingFromAllMemberCalendars(meetingId);
		return {
			synced: 0,
			skipped: 0,
			failed: removal.failed,
			errors: removal.errors,
		};
	}

	const respondingMemberIds = (
		await db
			.select({ memberId: availabilities.memberId })
			.from(availabilities)
			.where(eq(availabilities.meetingId, meetingId))
	).map((row) => row.memberId);

	const syncMemberIds = Array.from(
		new Set([...respondingMemberIds, meeting.hostId]),
	);

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
		.where(inArray(members.id, syncMemberIds));

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
				meeting,
				interval,
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
			return {
				status: "failed" as const,
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
