import "server-only";

import { db } from "@/db";
import { meetings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getExistingMeeting(meetingId: string) {
    const meeting = await db.query.meetings.findFirst({
        where: eq(meetings.id, meetingId),
    });

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
