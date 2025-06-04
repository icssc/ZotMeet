"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { InsertMeeting, meetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

export async function createMeeting(meetingData: InsertMeeting) {
    const { title, description, fromTime, toTime, timezone, dates } =
        meetingData;

    const { user } = await getCurrentSession();

    if (!user) {
        return { error: "You must be logged in to create a meeting." };
    }
    const hostId = user.memberId;

    if (
        fromTime >= toTime ||
        !dates?.length ||
        new Set(dates).size !== dates.length
    ) {
        return { error: "Invalid meeting dates or times." };
    }

    const meeting: InsertMeeting = {
        title,
        description,
        fromTime,
        toTime,
        timezone,
        hostId,
        dates: dates,
    };

    const [newMeeting] = await db
        .insert(meetings)
        .values(meeting)
        .returning({ id: meetings.id });

    redirect(`/availability/${newMeeting.id}`);
}
