"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { InsertMeeting, meetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { CreateMeetingPostParams } from "@/lib/types/meetings";
import { sql } from "drizzle-orm";

export async function createMeeting(meetingData: CreateMeetingPostParams) {
    const { title, description, fromTime, toTime, timezone, meetingDates } =
        meetingData;

    const { user } = await getCurrentSession();

    if (!user) {
        return { error: "You must be logged in to create a meeting." };
    }
    const hostId = user.memberId;

    if (
        fromTime >= toTime ||
        meetingDates.length === 0 ||
        new Set(meetingDates).size !== meetingDates.length ||
        meetingDates.some(
            (date) =>
                new Date(date).setHours(0, 0, 0, 0) <
                new Date().setHours(0, 0, 0, 0)
        )
    ) {
        // Nondescript error message.
        return { error: "Invalid meeting dates or times." };
    }

    const dates = meetingDates.map((d) => {
        const date = new Date(d);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    });

    const meeting: InsertMeeting = {
        title,
        description,
        fromTime,
        toTime,
        timezone,
        hostId,
        // ! FIX ME: TS is not recognizing sql`` as a valid type
        // @ts-expect-error trust me bro
        dates: sql`'${JSON.stringify(dates)}'::jsonb`,
        // dates: meetingDates.map((date: string) => new Date(date)),
    };

    const [newMeeting] = await db
        .insert(meetings)
        .values(meeting)
        .returning({ id: meetings.id });

    redirect(`/availability/${newMeeting.id}`);
}
