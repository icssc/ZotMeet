import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { availabilities, meetings, scheduledMeetings } from "@/db/schema";

export async function getMemberMeetingAvailability({
	memberId,
	meetingId,
}: {
	memberId: string;
	meetingId: string;
}) {
	const availabilityData = await db.query.availabilities.findFirst({
		where: and(
			eq(availabilities.memberId, memberId),
			eq(availabilities.meetingId, meetingId),
		),
	});

	if (!availabilityData) {
		throw new Error("Availability not found");
	}

	return availabilityData;
}

export async function getUserAvailabilitiesAndScheduled(memberId: string) {
	const userAvailabilities = await db
		.select({
			meetingId: availabilities.meetingId,
			meetingAvailabilities: availabilities.meetingAvailabilities,
		})
		.from(availabilities)
		.innerJoin(meetings, eq(availabilities.meetingId, meetings.id))
		.where(
			and(eq(availabilities.memberId, memberId), eq(meetings.archived, false)),
		);

	if (userAvailabilities.length === 0) {
		return { userAvailabilities: [], scheduledBlocks: [] };
	}
	const meetingIds = userAvailabilities.map((a) => a.meetingId);

	const scheduledBlocks = await db
		.select({
			scheduledDate: scheduledMeetings.scheduledDate,
			scheduledFromTime: scheduledMeetings.scheduledFromTime,
			scheduledToTime: scheduledMeetings.scheduledToTime,
			timezone: meetings.timezone,
		})
		.from(scheduledMeetings)
		.innerJoin(meetings, eq(scheduledMeetings.meetingId, meetings.id))
		.where(inArray(scheduledMeetings.meetingId, meetingIds));

	return { userAvailabilities, scheduledBlocks };
}
