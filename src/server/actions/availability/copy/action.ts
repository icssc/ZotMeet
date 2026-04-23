"use server";

import { getCurrentSession } from "@/lib/auth";
import {
	buildMeetingGridIsoSet,
	buildZotDateRowsForMeetingDays,
	convertTimeFromUTC,
	generateTimeBlocks,
	getTimeFromHourMinuteString,
	hasTimestampOnMeetingGrid,
} from "@/lib/availability/utils";
import type { HourMinuteString } from "@/lib/types/chrono";
import { findMemberMeetingAvailability } from "@/server/data/availability/queries";
import {
	getExistingMeeting,
	getMeetingsWithMemberAvailabilityExcluding,
	getMemberAvailabilitiesForMeetingIds,
} from "@/server/data/meeting/queries";

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
			viewerTimezone,
		);
		const gridIsoSet = buildMeetingGridIsoSet(
			zotRows,
			fromMinutes,
			availabilityTimeBlocks.length,
			viewerTimezone,
		);

		const respondedMeetings = await getMeetingsWithMemberAvailabilityExcluding({
			memberId,
			excludeMeetingId: currentMeetingId,
		});

		if (respondedMeetings.length === 0) {
			return { success: true as const, meetings: [] as const };
		}

		const candidateIds = respondedMeetings.map((m) => m.id);

		const availabilityRows = await getMemberAvailabilitiesForMeetingIds({
			memberId,
			meetingIds: candidateIds,
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
		const availabilityData = await findMemberMeetingAvailability({
			memberId: user.memberId,
			meetingId,
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
