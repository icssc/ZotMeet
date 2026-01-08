import "server-only";

import { db } from "@/db";
import {
	availabilities,
	meetings,
	members,
	type SelectMeeting,
} from "@/db/schema";
import type { MemberMeetingAvailability } from "@/lib/types/availability";
import { and, eq, or, sql } from "drizzle-orm";

export async function getExistingMeeting(
	meetingId: string,
): Promise<SelectMeeting> {
	const meeting = await db.query.meetings.findFirst({
		where: and(eq(meetings.id, meetingId), eq(meetings.archived, false)),
		orderBy: meetings.dates,
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
	const availability = await db
		.select({
			memberId: availabilities.memberId,
			meetingAvailabilities:
				sql`${availabilities.meetingAvailabilities}::jsonb`.as(
					"meetingAvailabilities",
				),
			displayName: members.displayName,
		})
		.from(availabilities)
		.innerJoin(members, eq(availabilities.memberId, members.id))
		.where(and(eq(availabilities.meetingId, meetingId)));

	return availability as {
		memberId: string;
		meetingAvailabilities: string[];
		displayName: string;
	}[];
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
