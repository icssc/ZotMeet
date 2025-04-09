"use server";

import { db } from "@/db";
import { availabilities } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { createGuest } from "@/lib/auth/user";
import { getExistingMeeting } from "@data/meeting/queries";

interface saveAvailabilityProps {
    meetingId: string;
    availabilityTimes: string[];
    displayName?: string;
}

export async function saveAvailability({
    meetingId,
    availabilityTimes,
    displayName,
}: saveAvailabilityProps) {
    try {
        // TODO: Implement the logic to save availability dates with the new schema
        // - Check if the user is logged in
        let { user } = await getCurrentSession();

        // - If so, get the id of the user
        // - If not, create a new member row and get the id
        if (!user) {
            user = await createGuest({
                displayName:
                    displayName ??
                    `TEST_${Math.floor(Math.random() * 1000 + 1)}`,
                meetingId,
            });
        }
        const memberId = user.memberId;

        // - Check if the meeting exists
        // - If so, get the id of the meeting
        // - If not, return an error
        const meeting = await getExistingMeeting(meetingId);

        if (!meeting) {
            throw new Error("Meeting not found");
        }

        // - Check if the user has existing availability for the meeting

        // - Validate the availability dates according to the dates column of the meeting table
        const meetingWindows = meeting.dates.map((date) => {
            const [month, day, year] = date.split("-");
            const formattedDate = `${year}-${month}-${day}`;

            // Create Date objects that represent the local time in the specified timezone
            const options = { timeZone: meeting.timezone };

            // Helper function to create ISO string adjusted for timezone
            function createAdjustedISO(dateStr: string, timeStr: string) {
                // Create a Date for the local time
                const localDate = new Date(`${dateStr}T${timeStr}`);

                // Convert to the target timezone's corresponding UTC time
                const targetDate = new Date(
                    localDate.toLocaleString("en-US", options)
                );
                const offset = localDate.getTime() - targetDate.getTime();
                const adjustedDate = new Date(localDate.getTime() + offset);

                return adjustedDate.toISOString();
            }

            return {
                start: createAdjustedISO(formattedDate, meeting.fromTime),
                end: createAdjustedISO(formattedDate, meeting.toTime),
            };
        });
        const isValid = validateAvailability(availabilityTimes, meetingWindows);

        if (!isValid) {
            throw new Error("Invalid availability dates");
        }

        // - If so, update the existing availability
        // - If not, create a new availability row
        await db
            .insert(availabilities)
            .values({
                memberId,
                meetingId,
                meetingAvailabilities: availabilityTimes,
            })
            .onConflictDoUpdate({
                target: [availabilities.memberId, availabilities.meetingId],
                set: {
                    meetingAvailabilities: availabilityTimes,
                },
            });

        return {
            status: 200,
            body: {
                message: "Saved successfully",
            },
        };
    } catch (error) {
        console.error("Error saving availabilities:", error);
        return {
            status: 500,
            body: {
                error: "Failed to save",
            },
        };
    }
}

function validateAvailability(
    availabilityTimes: string[],
    meetingWindows: Array<{ start: string; end: string }>,
    blockLength: number = 15
): boolean {
    const windowsByDate: Record<string, Array<{ start: Date; end: Date }>> = {};

    meetingWindows.forEach((window) => {
        const date = window.start.substring(0, 10);
        if (!windowsByDate[date]) {
            windowsByDate[date] = [];
        }
        windowsByDate[date].push({
            start: new Date(window.start),
            end: new Date(window.end),
        });
    });

    const slotDurationMs = blockLength * 60 * 1000;

    for (const time of availabilityTimes) {
        const startTime = new Date(time);
        const endTime = new Date(startTime.getTime() + slotDurationMs);
        const date = time.substring(0, 10);

        const dateWindows = windowsByDate[date];
        if (!dateWindows) {
            return false;
        }

        const isValidTime = dateWindows.some(
            (window) => startTime >= window.start && endTime <= window.end
        );

        if (!isValidTime) {
            return false;
        }
    }

    return true;
}
