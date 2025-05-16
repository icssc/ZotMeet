"use server";

import { db } from "@/db";
import { meetings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentSession } from "@/lib/auth";
import { CreateMeetingPostParams } from "@/lib/types/meetings";

export async function editMeeting(id: string, meetingData: CreateMeetingPostParams) {
    const meetingId = id;

    const { title, description, fromTime, toTime, timezone, meetingDates } =
        meetingData; //description and timezone could be edited in the future

    const { user } = await getCurrentSession();

    if (!user) {
        return { error: "You must be logged in to edit a meeting." };
    }

    if (
        fromTime >= toTime ||
        new Set(meetingDates).size !== meetingDates.length
    ) {
        return { error: "Invalid meeting dates or times." };
    }
    await db.update(meetings)
    .set({fromTime: fromTime, toTime: toTime})
    .where(eq(meetings.id, meetingId));

    if (title !== "") {
        await db.update(meetings)
        .set({title: title})
        .where(eq(meetings.id, meetingId));
    }
    if (meetingDates.length > 0) {
        await db.update(meetings)
        .set({dates: meetingDates})
        .where(eq(meetings.id, meetingId));
    }

    

    return {
        status: 200,
        body: {
            message: "Saved successfully",
        },
    };    

}
