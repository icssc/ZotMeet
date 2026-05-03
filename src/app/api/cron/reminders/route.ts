import { fromZonedTime } from "date-fns-tz";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { availabilities, users } from "@/db/schema";
import {
	getScheduledMeetingsNeedingReminder,
	markReminderSent,
} from "@/server/data/meeting/queries";
import { createNewNotification } from "@/server/data/user/queries";

export async function GET(req: Request) {
	const secret = process.env.CRON_SECRET;
	if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const candidates = await getScheduledMeetingsNeedingReminder();

	const now = new Date();
	const windowEnd = new Date(now.getTime() + 35 * 60000);
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

	// Group all blocks by meeting — a 1-hour meeting has 4 x 15-min blocks,
	// but we only want one notification per meeting.
	const byMeeting = new Map<string, typeof candidates>();
	for (const block of candidates) {
		if (!byMeeting.has(block.meetingId)) byMeeting.set(block.meetingId, []);
		byMeeting.get(block.meetingId)!.push(block);
	}

	let processed = 0;

	for (const [meetingId, blocks] of byMeeting) {
		// Use the earliest block to determine when the meeting starts
		const earliest = blocks.reduce((a, b) => {
			const aStart = fromZonedTime(
				`${a.scheduledDate.getFullYear()}-${String(a.scheduledDate.getMonth() + 1).padStart(2, "0")}-${String(a.scheduledDate.getDate()).padStart(2, "0")}T${a.scheduledFromTime}`,
				a.timezone,
			);
			const bStart = fromZonedTime(
				`${b.scheduledDate.getFullYear()}-${String(b.scheduledDate.getMonth() + 1).padStart(2, "0")}-${String(b.scheduledDate.getDate()).padStart(2, "0")}T${b.scheduledFromTime}`,
				b.timezone,
			);
			return aStart <= bStart ? a : b;
		});

		const { scheduledDate, scheduledFromTime, timezone } = earliest;
		const yyyy = scheduledDate.getFullYear();
		const mm = String(scheduledDate.getMonth() + 1).padStart(2, "0");
		const dd = String(scheduledDate.getDate()).padStart(2, "0");
		const utcStart = fromZonedTime(
			`${yyyy}-${mm}-${dd}T${scheduledFromTime}`,
			timezone,
		);

		if (utcStart <= now || utcStart > windowEnd) continue;

		const memberUsers = await db
			.select({ userId: users.id })
			.from(availabilities)
			.innerJoin(users, eq(availabilities.memberId, users.memberId))
			.where(eq(availabilities.meetingId, meetingId));

		const userIds = memberUsers.map(({ userId }) => userId);

		if (userIds.length > 0) {
			await createNewNotification(
				userIds,
				earliest.title,
				`Your meeting starts in 30 minutes.`,
				"Meeting Reminder",
				`${baseUrl}/availability/${meetingId}`,
				earliest.groupId ?? null,
				null,
			);
		}

		// Stamp all blocks for this meeting so none of them trigger again
		await markReminderSent(meetingId);
		processed++;
	}

	return NextResponse.json({ processed });
}
