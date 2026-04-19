import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { availabilities } from "@/db/schema";

/** One row or `undefined` if the member has not saved availability for this meeting. */
export async function findMemberMeetingAvailability({
	memberId,
	meetingId,
}: {
	memberId: string;
	meetingId: string;
}) {
	return db.query.availabilities.findFirst({
		where: and(
			eq(availabilities.memberId, memberId),
			eq(availabilities.meetingId, meetingId),
		),
	});
}
