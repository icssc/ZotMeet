import "server-only";

import { and, eq, gt, isNull, or } from "drizzle-orm";
import { db } from "@/db";
import { meetingInvites, type SelectMeetingInvite } from "@/db/schema";

export async function getExistingMeetingInvite(
	meetingId: string,
): Promise<SelectMeetingInvite | null> {
	const [invite] = await db
		.select()
		.from(meetingInvites)
		.where(
			and(
				eq(meetingInvites.meetingId, meetingId),
				or(
					isNull(meetingInvites.expiresAt),
					gt(meetingInvites.expiresAt, new Date()),
				),
			),
		)
		.limit(1);

	return invite ?? null;
}
