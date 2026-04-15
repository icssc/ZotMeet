"use server";

import { and, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { availabilities, meetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import {
	buildMeetingGridIsoSet,
	buildZotDateRowsForMeetingDays,
	hasTimestampOnMeetingGrid,
} from "@/lib/availability/meeting-grid";
import {
	convertTimeFromUTC,
	generateTimeBlocks,
	getTimeFromHourMinuteString,
} from "@/lib/availability/utils";
import type { HourMinuteString } from "@/lib/types/chrono";
import { getExistingMeeting } from "@/server/data/meeting/queries";

export async function getRespondedMeetings(excludeMeetingId: string) {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			success: false,
			message: "User not logged in!",
		};
	}

	const memberId = user.memberId;
	try {
		//finds all meetingIds where user has availability row
		const respondedMeetingIds = db
			.select({ meetingId: availabilities.meetingId })
			.from(availabilities)
			.where(eq(availabilities.memberId, memberId));

		const respondedMeetings = await db
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

		return {
			success: true as const,
			meetings: respondedMeetings,
		};
	} catch (error) {
		console.error("Error fetching responded meetings: ", error);
		return {
			success: false,
			message: "Failed to fetch meetings",
		};
	}
}

/** Past meetings where the user saved at least one slot that overlaps the current meeting’s grid (viewer timezone). */
export async function getImportableMeetings(
	currentMeetingId: string,
	viewerTimezone: string,
) {
	const { user } = await getCurrentSession();

	if (!user?.memberId) {
		return {
			success: false as const,
			message: "User not logged in!",
		};
	}

	const memberId = user.memberId;

	try {
		const meeting = await getExistingMeeting(currentMeetingId);
		const referenceDate = meeting.dates[0];
		if (!referenceDate) {
			return { success: true as const, meetings: [] as const };
		}

		const fromTimeLocal = convertTimeFromUTC(
			meeting.fromTime,
			viewerTimezone,
			referenceDate,
		);
		const toTimeLocal = convertTimeFromUTC(
			meeting.toTime,
			viewerTimezone,
			referenceDate,
		);
		const fromMinutes = getTimeFromHourMinuteString(
			fromTimeLocal as HourMinuteString,
		);
		const toMinutes = getTimeFromHourMinuteString(
			toTimeLocal as HourMinuteString,
		);
		const availabilityTimeBlocks = generateTimeBlocks(fromMinutes, toMinutes);
		const zotRows = buildZotDateRowsForMeetingDays(
			meeting.dates,
			availabilityTimeBlocks,
		);
		const gridIsoSet = buildMeetingGridIsoSet(
			zotRows,
			fromMinutes,
			availabilityTimeBlocks.length,
		);

		const respondedMeetingIds = db
			.select({ meetingId: availabilities.meetingId })
			.from(availabilities)
			.where(eq(availabilities.memberId, memberId));

		const respondedMeetings = await db
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
					ne(meetings.id, currentMeetingId),
				),
			)
			.orderBy(desc(meetings.createdAt));

		if (respondedMeetings.length === 0) {
			return { success: true as const, meetings: [] as const };
		}

		const candidateIds = respondedMeetings.map((m) => m.id);

		const availabilityRows = await db.query.availabilities.findMany({
			where: and(
				eq(availabilities.memberId, memberId),
				inArray(availabilities.meetingId, candidateIds),
			),
		});

		const overlappingIds = new Set(
			availabilityRows
				.filter((row) =>
					hasTimestampOnMeetingGrid(row.meetingAvailabilities, gridIsoSet),
				)
				.map((r) => r.meetingId),
		);

		const meetingsFiltered = respondedMeetings.filter((m) =>
			overlappingIds.has(m.id),
		);

		return {
			success: true as const,
			meetings: meetingsFiltered,
		};
	} catch (error) {
		console.error("getImportableMeetings:", error);
		return {
			success: false as const,
			message: "Failed to fetch importable meetings",
		};
	}
}

export async function getUserAvailabilityForMeeting(meetingId: string) {
	const { user } = await getCurrentSession();

	if (!user) {
		return { success: false as const, message: "User not logged in" };
	}

	try {
		const availabilityData = await db.query.availabilities.findFirst({
			where: and(
				eq(availabilities.memberId, user.memberId),
				eq(availabilities.meetingId, meetingId),
			),
		});

		if (!availabilityData) {
			return { success: false as const, message: "No availability found" };
		}

		return {
			success: true as const,
			meetingAvailabilities: availabilityData.meetingAvailabilities,
		};
	} catch (error) {
		console.error("Error fetching availability:", error);
		return { success: false as const, message: "Failed to fetch availability" };
	}
}
