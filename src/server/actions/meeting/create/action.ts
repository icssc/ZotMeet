"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { InsertMeeting, meetings} from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { CreateMeetingPostParams } from "@/lib/types/meetings";

export async function createMeeting(meetingData: CreateMeetingPostParams) {
    const { title, description, fromTime, toTime, timezone, meetingDates, selectedWeekdays, meetingType } =
        meetingData;

    const { user } = await getCurrentSession();

    if (!user) {
        return { error: "You must be logged in to create a meeting." };
    }
    const hostId = user.memberId;

    if (fromTime >= toTime) {
        return { error: "Invalid meeting times." };
    }

    if (meetingType === 'dates') {
        if (!meetingDates || meetingDates.length === 0) {
            return { error: "No meeting dates provided." };
        }
        if (new Set(meetingDates).size !== meetingDates.length) {
             return { error: "Duplicate meeting dates provided." };
        }
    } else if (meetingType === 'days') {
        if (!selectedWeekdays || selectedWeekdays.length !== 7 || selectedWeekdays.every(day => day === false)) {
             return { error: "Invalid weekdays selected." };
        }
    } else {
         return { error: "Invalid meeting type provided." };
    }

    const meeting: InsertMeeting = {
        title,
        description,
        fromTime,
        toTime,
        timezone,
        hostId,
        dates: meetingType === 'dates' ? meetingDates : [],
        selectedWeekdays: meetingType === 'days' ? selectedWeekdays : [],
        meetingType: meetingType,
    };

    const [newMeeting] = await db
        .insert(meetings)
        .values(meeting)
        .returning({ id: meetings.id });

    redirect(`/availability/${newMeeting.id}`);
}
