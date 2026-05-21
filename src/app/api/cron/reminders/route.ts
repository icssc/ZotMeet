import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { formatLocalDateKey, getBlockStartUtc } from "@/lib/meetings/utils";
import {
	getNotifiableUserIdsByMeeting,
	getScheduledMeetingsNeedingReminder,
	markReminderSentForOccurrence,
} from "@/server/data/meeting/queries";
import { createNewNotification } from "@/server/data/user/queries";

const REMINDER_WINDOW_START_MS = 25 * 60_000;
const REMINDER_WINDOW_END_MS = 35 * 60_000;

function isAuthorized(req: Request, secret: string): boolean {
	const header = req.headers.get("authorization");
	if (!header) return false;
	const expected = Buffer.from(`Bearer ${secret}`);
	const received = Buffer.from(header);
	if (expected.length !== received.length) return false;
	return timingSafeEqual(expected, received);
}

type Occurrence = {
	meetingId: string;
	scheduledDate: Date;
	scheduledFromTime: string;
	timezone: string;
	title: string;
	groupId: string | null;
	startUtc: Date;
};

export async function GET(req: Request) {
	const secret = process.env.CRON_SECRET;
	if (!secret || !isAuthorized(req, secret)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const candidates = await getScheduledMeetingsNeedingReminder();

	const now = new Date();
	const windowStart = new Date(now.getTime() + REMINDER_WINDOW_START_MS);
	const windowEnd = new Date(now.getTime() + REMINDER_WINDOW_END_MS);
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

	// Group rows into occurrences keyed by (meetingId, scheduledDate).
	// Multiple 15-min contiguous rows on the same date are a single occurrence;
	// rows on different dates (e.g. weekly meetings) are distinct occurrences.
	const occurrencesByKey = new Map<string, Occurrence>();
	for (const block of candidates) {
		const key = `${block.meetingId}|${formatLocalDateKey(block.scheduledDate)}`;
		const existing = occurrencesByKey.get(key);
		if (!existing) {
			occurrencesByKey.set(key, {
				meetingId: block.meetingId,
				scheduledDate: block.scheduledDate,
				scheduledFromTime: block.scheduledFromTime,
				timezone: block.timezone,
				title: block.title,
				groupId: block.groupId,
				startUtc: getBlockStartUtc(
					block.scheduledDate,
					block.scheduledFromTime,
					block.timezone,
				),
			});
			continue;
		}
		if (block.scheduledFromTime < existing.scheduledFromTime) {
			existing.scheduledFromTime = block.scheduledFromTime;
			existing.startUtc = getBlockStartUtc(
				block.scheduledDate,
				block.scheduledFromTime,
				block.timezone,
			);
		}
	}

	const eligible: Occurrence[] = [];
	for (const occ of occurrencesByKey.values()) {
		if (occ.startUtc >= windowStart && occ.startUtc <= windowEnd) {
			eligible.push(occ);
		}
	}

	if (eligible.length === 0) {
		return NextResponse.json({ processed: 0 });
	}

	const userIdsByMeeting = await getNotifiableUserIdsByMeeting(
		eligible.map((o) => o.meetingId),
	);

	let processed = 0;
	for (const occ of eligible) {
		const userIds = userIdsByMeeting.get(occ.meetingId) ?? [];
		if (userIds.length === 0) continue;

		const minutesUntil = Math.max(
			1,
			Math.round((occ.startUtc.getTime() - now.getTime()) / 60_000),
		);

		await createNewNotification(
			userIds,
			occ.title,
			`Your meeting starts in ${minutesUntil} minutes.`,
			"Meeting Reminder",
			`${baseUrl}/availability/${occ.meetingId}`,
			occ.groupId ?? null,
			null,
		);
		await markReminderSentForOccurrence(occ.meetingId, occ.scheduledDate);
		processed++;
	}

	return NextResponse.json({ processed });
}
