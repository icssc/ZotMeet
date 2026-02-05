import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { availabilities } from "@/db/schema";

export async function getMemberMeetingAvailability({
	memberId,
	meetingId,
}: {
	memberId: string;
	meetingId: string;
}) {
	const availabilityData = await db.query.availabilities.findFirst({
		where: {
			memberId: memberId,
			meetingId: meetingId,
		},
	});

	if (!availabilityData) {
		throw new Error("Availability not found");
	}

	return availabilityData;
}
