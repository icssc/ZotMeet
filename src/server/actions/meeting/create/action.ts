"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { InsertMeeting, meetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { ANCHOR_DATES } from "@/lib/types/chrono";
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
    } = meetingData;

    const { user } = await getCurrentSession();

    if (!user) {
        return { error: "You must be logged in to create a meeting." };
    }
    const hostId = user.memberId;

    if (fromTime >= toTime) {
        return { error: "Invalid meeting times." };
    }

    if (!meetingDates || meetingDates.length === 0) {
        return { error: "No meeting dates provided." };
    }
    if (new Set(meetingDates).size !== meetingDates.length) {
        return { error: "Duplicate meeting dates provided." };
    }
    if (meetingType === "days") {
        const invalidAnchorDates = meetingDates.filter(
            (date) => !ANCHOR_DATES.includes(date)
        );
        if (invalidAnchorDates.length > 0) {
            return { error: "Invalid date format for selected weekdays." };
        }
    }

    const meeting: InsertMeeting = {
        title,
        description,
        fromTime,
        toTime,
        timezone,
        hostId,
        dates: meetingDates,
        meetingType: meetingType,
    };

    const [newMeeting] = await db
        .insert(meetings)
        .values(meeting)
        .returning({ id: meetings.id });

    redirect(`/availability/${newMeeting.id}`);
}
