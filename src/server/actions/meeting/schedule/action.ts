"use server";

import { db } from "@/db";
import { meetings } from "@/db/schema";
import { getExistingMeeting } from "@/server/data/meeting/queries";
import { eq } from "drizzle-orm";

export async function saveMeetingSchedule({
    meetingId,
    scheduledFromTime,
    scheduledToTime,
    scheduledDate,
}: {
    meetingId: string;
    scheduledFromTime: string;
    scheduledToTime: string;
    scheduledDate: Date;
}) {
    try {
        const meeting = await getExistingMeeting(meetingId);
        if (!meeting) {
            return { error: "Invalid meeting ID" };
        }

        await db
            .update(meetings)
            .set({
                scheduledFromTime,
                scheduledToTime,
                scheduledDate,
                scheduled: true,
            })
            .where(eq(meetings.id, meetingId));
        return { success: true };
    } catch (error) {
        console.error("Error saving meeting schedule:", error);
        return { error: "Failed to save meeting schedule." };
    }
}
