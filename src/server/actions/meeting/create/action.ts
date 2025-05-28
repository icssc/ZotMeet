"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { InsertMeeting, meetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { CreateMeetingPostParams } from "@/lib/types/meetings";

export async function createMeeting(meetingData: CreateMeetingPostParams) {
    const {
        title,
        description,
        fromTime,
        toTime,
        timezone,
        meetingDates,
        meetingType,
        recurringDays,
    } = meetingData;

    const { user } = await getCurrentSession();

    if (!user) {
        return { error: "You must be logged in to create a meeting." };
    }
    const hostId = user.memberId;

    // Validation based on meeting type
    if (meetingType === "specificDates") {
        if (
            !meetingDates ||
            meetingDates.length === 0 ||
            new Set(meetingDates).size !== meetingDates.length
        ) {
            return { error: "Invalid meeting dates." };
        }
    } else if (meetingType === "recurringWeekly") {
        if (
            !recurringDays ||
            recurringDays.length === 0 ||
            recurringDays.some((day) => day < 0 || day > 6) ||
            new Set(recurringDays).size !== recurringDays.length
        ) {
            return { error: "Invalid recurring days." };
        }
    } else {
        return { error: "Invalid meeting type." };
    }

    if (fromTime >= toTime) {
        return { error: "Invalid meeting times. From time must be before to time." };
    }

    const meeting: InsertMeeting = {
        title,
        description,
        fromTime,
        toTime,
        timezone,
        hostId,
        meetingType,
        // Conditionally add dates or recurringDays
        ...(meetingType === "specificDates" && { dates: meetingDates }),
        ...(meetingType === "recurringWeekly" && { recurringDays: recurringDays }),
    };

    const [newMeeting] = await db
        .insert(meetings)
        .values(meeting)
        .returning({ id: meetings.id });

    redirect(`/availability/${newMeeting.id}`);
}
