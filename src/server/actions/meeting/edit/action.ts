"use server";

import { db } from "@/db";
import { meetings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentSession } from "@/lib/auth";
import { CreateMeetingPostParams } from "@/lib/types/meetings";
import { SelectMeeting } from "@/db/schema";


export async function editMeeting(originalMeeting: SelectMeeting, meetingData: CreateMeetingPostParams) {
    const { user } = await getCurrentSession();

    if (!user) {
        return { error: "You must be logged in to edit a meeting." };
    }

    const { fromTime, toTime, description: _description, timezone: _timezone } = meetingData;
    let { title, meetingDates } = meetingData; // description and timezone could be edited in the future

    if (
        fromTime >= toTime ||
        new Set(meetingDates).size !== meetingDates.length
    ) {
        return { error: "Invalid meeting dates or times." };
    }
    if (title === "") {
        title = originalMeeting.title;
    }
    if (meetingDates.length === 0) {
        meetingDates = originalMeeting.dates;
    }
    await db.update(meetings)
    .set({title: title, dates: meetingDates, fromTime: fromTime, toTime: toTime})
    .where(eq(meetings.id, originalMeeting.id));

    return {
        status: 200,
        body: {
            message: "Saved successfully",
        },
    };    

}
