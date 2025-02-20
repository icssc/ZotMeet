"use server";

import { getCurrentSession } from "@/lib/auth";
import { ZotDate } from "@/lib/zotdate";

interface saveAvailabilityProps {
    meetingId: string;
    availabilityDates: Pick<ZotDate, "day" | "availability">[];
}

export async function saveAvailability({
    meetingId,
    availabilityDates,
}: saveAvailabilityProps) {
    try {
        // TODO: Implement the logic to save availability dates with the new schema
        // - Check if the user is logged in
        const { user } = await getCurrentSession();

        // - If so, get the id of the user
        // - If not, create a new member row and get the id

        // - Check if the meeting exists
        // - If so, get the id of the meeting
        // - If not, return an error

        // - Check if the user has existing availability for the meeting

        // - Validate the availability dates according to the dates column of the meeting table

        // - If so, update the existing availability
        // - If not, create a new availability row

        return {
            status: 200,
            body: {
                message: "Saved successfully",
            },
        };
    } catch (error) {
        console.log("Error saving availabilities:", error);
        return {
            status: 500,
            body: {
                error: "Failed to save",
            },
        };
    }
}
