import "server-only";

import { and, eq, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
	availabilities,
	meetings,
	type SelectMeeting,
	scheduledMeetings,
} from "@/db/schema";
import type { MemberMeetingAvailability } from "@/lib/types/availability";

export async function getExistingMeeting(
	meetingId: string,
): Promise<SelectMeeting> {
	const meeting = await db.query.meetings.findFirst({
		where: and(eq(meetings.id, meetingId), eq(meetings.archived, false)),
	});

	if (!meeting) {
		throw new Error("Meeting not found");
	}

	return meeting;
}

// TODO (#auth): Replace `user` with User type
export const getAvailability = async ({
	userId,
	meetingId,
}: {
	userId: string;
	meetingId: string;
}) => {
	const availability = await db.query.availabilities.findFirst({
		extras: {
			meetingAvailabilities:
				sql`${availabilities.meetingAvailabilities}::jsonb`.as(
					"meetingAvailabilities",
				),
		},
		where: and(
			eq(availabilities.memberId, userId),
			eq(availabilities.meetingId, meetingId),
		),
	});

	if (!availability) {
		return;
	}
	return availability;
};

export const getAllMemberAvailability = async ({
	meetingId,
}: {
	meetingId: string;
}): Promise<MemberMeetingAvailability[]> => {
	const availabilityData = await db.query.availabilities.findMany({
		where: eq(availabilities.meetingId, meetingId),
		with: {
			member: true,
		},
	});

	return availabilityData.map((a) => ({
		memberId: a.memberId,
		meetingAvailabilities: a.meetingAvailabilities,
		displayName: a.member.displayName,
	}));
};

export async function getMeetings(memberId: string) {
	const hasAvailability = db
		.select({ meetingId: availabilities.meetingId })
		.from(availabilities)
		.where(eq(availabilities.memberId, memberId));

	const userMeetings = await db
		.select({
			id: meetings.id,
			title: meetings.title,
			description: meetings.description,
			location: meetings.location,
			scheduled: meetings.scheduled,
			fromTime: meetings.fromTime,
			toTime: meetings.toTime,
			timezone: meetings.timezone,
			dates: meetings.dates,
			hostId: meetings.hostId,
			group_id: meetings.group_id,
			createdAt: meetings.createdAt,
			archived: meetings.archived,
			meetingType: meetings.meetingType,
		})
		.from(meetings)
		.where(
			and(
				eq(meetings.archived, false),
				or(
					eq(meetings.hostId, memberId),
					sql`${meetings.id} IN ${hasAvailability}`,
				),
			),
		);

	return userMeetings;
}

/**
 * Fetch scheduled blocks for a meeting from scheduled_meetings table
 */
export async function getScheduledTimeBlocks(meetingId: string) {
	const rows = await db
		.select()
		.from(scheduledMeetings)
		.where(eq(scheduledMeetings.meetingId, meetingId));

	if (!rows) {
		throw new Error("Scheduled blocks not found");
	}

	return rows; // array of scheduled blocks
}
