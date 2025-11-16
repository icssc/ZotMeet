"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { InsertMeeting, meetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

export async function createMeetingFromData(
    meetingData: Omit<InsertMeeting, "hostId">,
    hostId: string
): Promise<{ id: string } | { error: string }> {
    const {
        title,
        description,
        fromTime,
        toTime,
        timezone,
        dates,
        meetingType,
    } = meetingData;

    if (!dates?.length || new Set(dates).size !== dates.length) {
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
        meetingType: meetingType || "dates",
    };

    try {
        const [newMeeting] = await db
            .insert(meetings)
            .values(meeting)
            .returning({ id: meetings.id });

        return { id: newMeeting.id };
    } catch (error) {
        console.error("Failed to create meeting:", error);
        return { error: "Failed to create meeting." };
    }
}

export async function createMeeting(meetingData: InsertMeeting) {
    const {
        title,
        description,
        fromTime,
        toTime,
        timezone,
        dates,
        meetingType,
    } = meetingData;

    const { user } = await getCurrentSession();

    if (!user) {
        return { error: "You must be logged in to create a meeting." };
    }
    const hostId = user.memberId;

    if (!dates?.length || new Set(dates).size !== dates.length) {
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
        meetingType: meetingType || "dates",
    };

    const [newMeeting] = await db
        .insert(meetings)
        .values(meeting)
        .returning({ id: meetings.id });

    redirect(`/availability/${newMeeting.id}`);
}
