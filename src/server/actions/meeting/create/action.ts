"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { InsertMeeting, meetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

export async function createMeeting(meetingData: InsertMeeting) {
    const {
        title,
        description,
        fromTime,
        toTime,
        timezone,
        dates,
        meetingType,
        recurringDays,
    } = meetingData;

    const { user } = await getCurrentSession();

    if (!user) {
        return { error: "You must be logged in to create a meeting." };
    }
    const hostId = user.memberId;

    switch (meetingType) {
        case "specificDates":
            if (
                !dates ||
                dates.length === 0 ||
                new Set(dates).size !== dates.length
            ) {
                return { error: "Invalid meeting dates." };
            }
            break;
        case "recurringWeekly":
            if (
                !recurringDays ||
                recurringDays.length === 0 ||
                recurringDays.some((day) => day < 0 || day > 6) ||
                new Set(recurringDays).size !== recurringDays.length
            ) {
                return { error: "Invalid recurring days." };
            }
            break;
        default:
            // TODO: Use safeUnreachableCase
            return { error: "Invalid meeting type." };
    }

    if (fromTime >= toTime) {
        return {
            error: "Invalid meeting times. From time must be before to time.",
        };
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
        ...(meetingType === "specificDates" && { dates }),
        ...(meetingType === "recurringWeekly" && {
            recurringDays: recurringDays,
        }),
    };

    const [newMeeting] = await db
        .insert(meetings)
        .values(meeting)
        .returning({ id: meetings.id });

    redirect(`/availability/${newMeeting.id}`);
}
