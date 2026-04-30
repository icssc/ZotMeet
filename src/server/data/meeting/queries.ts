import "server-only";

import {
	and,
	countDistinct,
	desc,
	eq,
	inArray,
	ne,
	or,
	sql,
} from "drizzle-orm";
import { db } from "@/db";
import {
	availabilities,
	meetings,
	members,
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
		ifNeededAvailabilities: a.ifNeededAvailabilities,
		displayName: a.member.displayName,
		profilePicture: a.member.profilePicture,
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
			hostDisplayName: members.displayName,
		})
		.from(meetings)
		.leftJoin(members, eq(meetings.hostId, members.id))
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

export async function getResponderCountsByMeetingIds(
	meetingIds: string[],
): Promise<Record<string, number>> {
	if (meetingIds.length === 0) {
		return {};
	}

	const rows = await db
		.select({
			meetingId: availabilities.meetingId,
			respondedCount: countDistinct(availabilities.memberId),
		})
		.from(availabilities)
		.where(inArray(availabilities.meetingId, meetingIds))
		.groupBy(availabilities.meetingId);

	return Object.fromEntries(
		rows.map((row) => [row.meetingId, Number(row.respondedCount)]),
	);
}

export async function getScheduledMeetingsByMeetingIds(
	meetingIds: string[],
): Promise<
	Record<
		string,
		{ scheduledDate: Date; scheduledFromTime: string; scheduledToTime: string }
	>
> {
	if (meetingIds.length === 0) return {};

	const rows = await db
		.select({
			meetingId: scheduledMeetings.meetingId,
			scheduledDate: scheduledMeetings.scheduledDate,
			scheduledFromTime: scheduledMeetings.scheduledFromTime,
			scheduledToTime: scheduledMeetings.scheduledToTime,
		})
		.from(scheduledMeetings)
		.where(inArray(scheduledMeetings.meetingId, meetingIds));

	const result: Record<
		string,
		{ scheduledDate: Date; scheduledFromTime: string; scheduledToTime: string }
	> = {};
	for (const row of rows) {
		if (!result[row.meetingId]) {
			result[row.meetingId] = {
				scheduledDate: row.scheduledDate,
				scheduledFromTime: row.scheduledFromTime,
				scheduledToTime: row.scheduledToTime,
			};
		}
	}
	return result;
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

/** Non-archived meetings the member has availability for, excluding one meeting (e.g. current poll). */
export async function getMeetingsWithMemberAvailabilityExcluding({
	memberId,
	excludeMeetingId,
}: {
	memberId: string;
	excludeMeetingId: string;
}) {
	const respondedMeetingIds = db
		.select({ meetingId: availabilities.meetingId })
		.from(availabilities)
		.where(eq(availabilities.memberId, memberId));

	return db
		.select({
			id: meetings.id,
			title: meetings.title,
			createdAt: meetings.createdAt,
		})
		.from(meetings)
		.where(
			and(
				eq(meetings.archived, false),
				sql`${meetings.id} IN ${respondedMeetingIds}`,
				ne(meetings.id, excludeMeetingId),
			),
		)
		.orderBy(desc(meetings.createdAt));
}

/** Availability rows for one member across many meetings (e.g. import/copy flows). */
export async function getMemberAvailabilitiesForMeetingIds({
	memberId,
	meetingIds,
}: {
	memberId: string;
	meetingIds: string[];
}) {
	if (meetingIds.length === 0) {
		return [];
	}

	return db.query.availabilities.findMany({
		where: and(
			eq(availabilities.memberId, memberId),
			inArray(availabilities.meetingId, meetingIds),
		),
	});
}
