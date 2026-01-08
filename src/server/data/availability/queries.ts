import "server-only";

import { db } from "@/db";
import { availabilities } from "@/db/schema";
import { and, eq } from "drizzle-orm";

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
