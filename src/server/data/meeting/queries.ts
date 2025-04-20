import "server-only";

import { db } from "@/db";
import { availabilities, meetings, SelectMeeting } from "@/db/schema";
import { MemberMeetingAvailability } from "@/lib/types/availability";
import { and, eq, sql } from "drizzle-orm";
import { jsonb } from "drizzle-orm/pg-core";

export async function getExistingMeeting(
    meetingId: string
): Promise<SelectMeeting> {
    const meeting = await db.query.meetings.findFirst({
        where: eq(meetings.id, meetingId),
    });

    if (!meeting) {
        throw new Error("Meeting not found");
    }

    return meeting;
}

export async function getExistingMeetingDates(meetingId: string) {
    const meetingDates = await db.query.meetings.findFirst({
        columns: {
            dates: true,
        },
        where: eq(meetings.id, meetingId),
    });

    if (!meetingDates) {
        throw new Error("Meeting not found");
    }

    const { dates } = meetingDates;

    // TODO: sort dates in ascending order
    return dates;
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
                    "meetingAvailabilities"
                ),
        },
        where: and(
            eq(availabilities.memberId, userId),
            eq(availabilities.meetingId, meetingId)
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
    const availability = await db
        .select({
            memberId: availabilities.memberId,
            meetingAvailabilities: availabilities.meetingAvailabilities,
        })
        .from(availabilities)
        .where(and(eq(availabilities.meetingId, meetingId)));

    return availability;
};
