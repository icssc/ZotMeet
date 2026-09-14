import "server-only";

import { getExistingMeeting } from "@data/meeting/queries";
import { db } from "@/db";
import { availabilities } from "@/db/schema";

/**
 * The authorised core of saving a member's personal availability, shared by
 * the session-cookie server action (`@actions/availability/save`) and the
 * bearer-token API route (`/api/meetings/[id]/availability`).
 *
 * Deliberately not a `"use server"` module — see `meeting/member-actions.ts`
 * for why: `memberId` is taken on trust, the caller has authenticated it.
 */
export async function savePersonalAvailabilityForMember(args: {
	meetingId: string;
	memberId: string;
	meetingAvailabilityTimes: readonly string[];
	ifNeededAvailabilityTimes: readonly string[];
}): Promise<{ groupId: string | null }> {
	const { meetingId, memberId, meetingAvailabilityTimes } = args;
	const ifNeededAvailabilities = [...args.ifNeededAvailabilityTimes];

	const meeting = await getExistingMeeting(meetingId);
	if (!meeting) {
		throw new Error("Meeting not found");
	}

	// A slot marked both ways is if-needed; available wins nowhere here so the
	// two columns stay disjoint.
	const ifNeededSet = new Set(ifNeededAvailabilities);
	const meetingAvailabilities = meetingAvailabilityTimes.filter(
		(t) => !ifNeededSet.has(t),
	);

	await db
		.insert(availabilities)
		.values({
			memberId,
			meetingId,
			meetingAvailabilities,
			ifNeededAvailabilities,
		})
		.onConflictDoUpdate({
			target: [availabilities.memberId, availabilities.meetingId],
			set: { meetingAvailabilities, ifNeededAvailabilities },
		});

	return { groupId: meeting.group_id };
}
