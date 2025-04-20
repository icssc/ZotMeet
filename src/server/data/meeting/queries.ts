import "server-only";

import { db } from "@/db";
import {
    availabilities,
    meetings,
    members,
    type SelectMeeting,
} from "@/db/schema";
import { MemberMeetingAvailability } from "@/lib/types/availability";
import { and, eq, or, sql } from "drizzle-orm";

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
            meetingAvailabilities:
                sql`${availabilities.meetingAvailabilities}::jsonb`.as(
                    "meetingAvailabilities"
                ),
            displayName: members.displayName,
        })
        .from(availabilities)
        .innerJoin(members, eq(availabilities.memberId, members.id))
        .where(and(eq(availabilities.meetingId, meetingId)));

    return availability as {
        memberId: string;
        meetingAvailabilities: string[];
    }[];
};

export async function getMeetings(memberId: string) {
    const userMeetings = await db
        .select({
            id: meetings.id,
            title: meetings.title,
            description: meetings.description,
            location: meetings.location,
            scheduled: meetings.scheduled,
            fromTime: meetings.fromTime,
            toTime: meetings.toTime,
            timezone: meetings.timezone,
            dates: meetings.dates,
            hostId: meetings.hostId,
            group_id: meetings.group_id,
        })
        .from(meetings)
        .leftJoin(availabilities, eq(meetings.id, availabilities.meetingId))
        .where(
            or(
                eq(meetings.hostId, memberId),
                eq(availabilities.memberId, memberId)
            )
        );

    return userMeetings;
}
