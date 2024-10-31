import { db } from "@/db";
import {
    availabilities,
    AvailabilityMeetingDateJoinSchema,
    meetingDates,
    type MeetingDateSelectSchema,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";

// TODO (#auth): Replace `user` with User type
export const getAvailability = async (
    user: { id: string },
    meetingId: string
): Promise<AvailabilityMeetingDateJoinSchema[]> => {
    const availability = await db
        .select()
        .from(availabilities)
        .innerJoin(
            meetingDates,
            eq(availabilities.meeting_day, meetingDates.id)
        )
        .where(
            and(
                eq(availabilities.member_id, user.id),
                eq(meetingDates.meeting_id, meetingId || "")
            )
        );

    return availability.sort((a, b) =>
        a.meeting_dates.date > b.meeting_dates.date ? 1 : -1
    );
};

export const getMeetingDates = async (
    meetingId: string
): Promise<MeetingDateSelectSchema[]> => {
    const dbMeetingDates = await db
        .select()
        .from(meetingDates)
        .where(eq(meetingDates.meeting_id, meetingId));

    return dbMeetingDates.sort((a, b) => (a.date < b.date ? -1 : 1));
};
