import { db } from "@/db";
import {
    availabilities,
    AvailabilityMeetingDateJoinSchema,
    InsertMeeting,
    InsertMember,
    meetings,
    members,
    SelectMeeting,
    sessions,
    UserInsertSchema,
    users,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const getExistingMeeting = async (
    meetingId: string
): Promise<SelectMeeting> => {
    const [dbMeeting] = await db
        .select()
        .from(meetings)
        .where(eq(meetings.id, meetingId));

    return dbMeeting;
};

export const insertMeetingDates = async (
    dates: Date[],
    meeting_id: string,
    host_id: string
) => {
    const dbAvailabilities = dates.map((date) => {
        // Get the start of the date to better standardize
        return {
            meetingId: meeting_id,
            meetingAvailabilities: { date: [] },
            memberId: host_id,
        };
    });

    await db.insert(availabilities).values(dbAvailabilities);
};

export const getExistingMeetingDates = async (meetingId: string) => {
    const dbMeetingDates = await db
        .select({
            meetingAvailabilities: availabilities.meetingAvailabilities,
        })
        .from(availabilities)
        .where(eq(availabilities.meetingId, meetingId));

    const dates = new Set<string>();

    dbMeetingDates.forEach((row) => {
        const allAvailabilities = row;
        console.log("Meeting dates: ", row);
        for (const date in allAvailabilities) {
            dates.add(date);
        }
    });

    return Array.from(dates).sort((a, b) => (a < b ? -1 : 1));
};

// TODO (#auth): Replace `user` with User type
export const getAvailability = async ({
    userId,
    meetingId,
}: {
    userId: string;
    meetingId: string;
}): Promise<AvailabilityMeetingDateJoinSchema[]> => {
    const availability = await db
        .select({
            meetingAvailabilities: availabilities.meetingAvailabilities,
        })
        .from(availabilities)
        .where(
            and(
                eq(availabilities.memberId, userId),
                eq(availabilities.meetingId, meetingId)
            )
        );

    return availability;
};
