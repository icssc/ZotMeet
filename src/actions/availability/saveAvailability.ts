"use server";

import { db } from "@/db";
import {
    availabilities,
    AvailabilityInsertSchema,
    meetingDates,
    MeetingDateSelectSchema,
    membersInMeeting,
} from "@/db/schema";
import { getExistingMeeting } from "@/lib/db/databaseUtils";
import { ZotDate } from "@/lib/zotdate";
import { eq, sql } from "drizzle-orm";

interface saveAvailabilityProps {
    meetingId: string;
    availabilityDates: Pick<ZotDate, "day" | "availability">[];
}

export async function saveAvailability({
    meetingId,
    availabilityDates,
}: saveAvailabilityProps) {
    // const user: User | null = locals.user;

    let dbMeetingDates: MeetingDateSelectSchema[] = [];

    try {
        dbMeetingDates = await _getMeetingDates(meetingId);
    } catch (e) {
        console.log("Error getting meeting dates:", e);
    }

    if (!dbMeetingDates || dbMeetingDates.length === 0) {
        return;
    }

    try {
        // const memberId =
        //     user?.id ??
        //     (
        //         await getExistingGuest(
        //             formData.get("username") as string,
        //             await getExistingMeeting(meetingId)
        //         )
        //     ).id;

        const memberId = "123";

        const insertDates: AvailabilityInsertSchema[] = availabilityDates.map(
            (date, index) => ({
                day: new Date(date.day).toISOString(),
                member_id: memberId,
                meeting_day: dbMeetingDates[index].id as string, // Type-cast since id is guaranteed if a meetingDate exists
                availability_string: date.availability
                    .map((bool) => (bool ? "1" : "0"))
                    .join(""),
            })
        );

        await db.transaction(async (tx) => {
            await Promise.all([
                tx
                    .insert(availabilities)
                    .values(insertDates)
                    .onConflictDoUpdate({
                        target: [
                            availabilities.member_id,
                            availabilities.meeting_day,
                        ],
                        set: {
                            // `excluded` refers to the row currently in conflict
                            availability_string: sql.raw(
                                `excluded.availability_string`
                            ),
                        },
                    }),
                tx
                    .insert(membersInMeeting)
                    .values({ memberId, meetingId, attending: "maybe" })
                    .onConflictDoNothing(),
            ]);
        });

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

export async function _getMeetingDates(
    meetingId: string
): Promise<MeetingDateSelectSchema[]> {
    const dbMeeting = await getExistingMeeting(meetingId);
    const dbMeetingDates = await db
        .select()
        .from(meetingDates)
        .where(eq(meetingDates.meeting_id, dbMeeting.id));

    return dbMeetingDates.sort((a, b) => (a.date < b.date ? -1 : 1));
}
