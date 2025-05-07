"use server";

import { db } from "@/db";
import { availabilities } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
//import { createGuest } from "@/lib/auth/user";
import { getExistingMeeting } from "@data/meeting/queries";
import { UserRoundIcon } from "lucide-react";

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
        const { user } = await getCurrentSession();
        let memberId = user.memberId; 
        //Guest functionality disabled for now
        
        //TODO: Guest
        // if (!user) {
        //     const guest = await createGuest({
        //         displayName:
        //             displayName ??
        //             `TEST_${Math.floor(Math.random() * 1000 + 1)}`,
        //         meetingId,
        //     });
        //     memberId = guest.memberId;
        // } else {
        //     memberId = user.memberId;
        // }

        const meeting = await getExistingMeeting(meetingId);

        if (!meeting) {
            throw new Error("Meeting not found");
        }

        const meetingWindows = meeting.dates.map((date) => {
            const [month, day, year] = date.split("-");
            const formattedDate = `${year}-${month}-${day}`;

            return {
                start: createAdjustedISO(
                    formattedDate,
                    meeting.fromTime,
                    meeting.timezone
                ),
                end: createAdjustedISO(
                    formattedDate,
                    meeting.toTime,
                    meeting.timezone
                ),
            };
        });
        const isValid = validateAvailability(availabilityTimes, meetingWindows);

        if (!isValid) {
            throw new Error("Invalid availability dates");
        }

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

function createAdjustedISO(dateStr: string, timeStr: string, timezone: string) {
    const localDate = new Date(`${dateStr}T${timeStr}`);

    const targetDate = new Date(
        localDate.toLocaleString("en-US", { timeZone: timezone })
    );
    const offset = localDate.getTime() - targetDate.getTime();
    const adjustedDate = new Date(localDate.getTime() + offset);

    return adjustedDate.toISOString();
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
