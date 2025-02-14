"use server";

import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { CreateMeetingPostParams } from "@/lib/types/meetings";

export async function createMeeting(newMeeting: CreateMeetingPostParams) {
    try {
        const { title, description, fromTime, toTime, meetingDates } =
            newMeeting;

        // TODO: Re-write this according to the new database schema

        // - Check if the user is logged in
        const { user } = await getCurrentSession();

        // - If not, return an error (for now, guests are not allowed to create meetings)
        // - If so, get the member id of the user for the meeting's host id

        // - Check validity of the meeting dates and times (e.g. no duplicate dates, fromTime < toTime, etc.)

        // - Create a new row in the meetings table and get the id of the new meeting

        // - On the server (300 resopnse code), redirect the user to the meeting page
        redirect(`/availability/_`);
    } catch (err) {
        const error = err as Error;
        console.error("Error creating meeting:", error.message);

        return { error: `Error creating meeting: ${error.message}` };
    }
}
