"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { InsertMeeting, meetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { CreateMeetingPostParams } from "@/lib/types/meetings";

export async function createMeeting(meetingData: CreateMeetingPostParams) {
    try {
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

        const meeting: InsertMeeting = {
            title,
            description,
            fromTime,
            toTime,
            timezone,
            hostId,
            dates: meetingDates.map((date: string) => new Date(date)),
        };

        const [newMeeting] = await db
            .insert(meetings)
            .values(meeting)
            .returning({ id: meetings.id });

        redirect(`/availability/${newMeeting.id}`);

    } catch (err) {
        // if redirect error, throw redirect
        if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
            throw err;
        }

        const error = err as Error;
        console.error("Error creating meeting:", error.message);

        return { error: `Error creating meeting: ${error.message}` };
    }
}
