import { db } from "@/db";
import {
    availabilities,
    AvailabilityMeetingDateJoinSchema,
    InsertMeeting,
    InsertMember,
    meetings,
    members,
    SelectMeeting,
    sessions,
    UserInsertSchema,
    users,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";

// import type { ZodObject, ZodString } from "zod";

export const checkIfIdExists = async (id: string) => {
    const queryResult = await db
        .select({
            id: users.id,
        })
        .from(users)
        .where(eq(users.id, id));

    return queryResult.length > 0;
};

export const checkIfEmailExists = async (email: string) => {
    const queryResult = await db
        .select({
            email: users.email,
        })
        .from(users)
        .where(eq(users.email, email));

    return queryResult.length > 0;
};

export const insertNewMember = async (member: InsertMember) => {
    return await db.insert(members).values(member);
};

export const insertNewUser = async (user: UserInsertSchema) => {
    return await db.insert(users).values(user);
};

export const getAllUsers = async () => {
    const queryResult = await db
        .select({
            id: users.id,
            // displayName: users.displayName,
            email: users.email,
        })
        .from(users);

    return queryResult;
};

// export const getExistingUser = async (
//     form: SuperValidated<ZodObject<{ email: ZodString }>, AlertMessageType>
// ) => {
//     const [existingUser] = await db
//         .select({
//             id: users.id,
//             email: users.email,
//             password: users.password,
//             // authMethods: users.authMethods,
//         })
//         .from(users)
//         .where(eq(users.email, form.data.email as string));

//     return existingUser;
// };

export async function getUserIdFromSession(sessionId: string): Promise<string> {
    const [{ userId }] = await db
        .select({ userId: sessions.userId })
        .from(sessions)
        .where(eq(sessions.id, sessionId));

    return userId;
}

/**
 * @param meeting The meeting object to insert. `from_time` and `to_time` represent the start and end times
 * and are only used for the times of day.
 * @param meetingDates The dates to insert for the meeting. Only the date portion of the date object is used.
 * @returns The id of the inserted meeting.
 */
export const insertMeeting = async (
    meeting: InsertMeeting,
    meetingDates: Date[]
) => {
    const [dbMeeting] = await db.insert(meetings).values(meeting).returning();
    await insertMeetingDates(meetingDates, dbMeeting.id, dbMeeting.host_id);
    return dbMeeting.id;
};

export const getExistingMeeting = async (
    meetingId: string
): Promise<SelectMeeting> => {
    const [dbMeeting] = await db
        .select()
        .from(meetings)
        .where(eq(meetings.id, meetingId));

    return dbMeeting;
};

export const insertMeetingDates = async (
    dates: Date[],
    meeting_id: string,
    host_id: string
) => {
    const dbAvailabilities = dates.map((date) => {
        // Get the start of the date to better standardize
        return {
            meetingId: meeting_id,
            meetingAvailabilities: { date: [] },
            memberId: host_id,
        };
    });

    await db.insert(availabilities).values(dbAvailabilities);
};

export const getExistingMeetingDates = async (meetingId: string) => {
    const dbMeetingDates = await db
        .select({
            meetingAvailabilities: availabilities.meetingAvailabilities,
        })
        .from(availabilities)
        .where(eq(availabilities.meetingId, meetingId));

    const dates = new Set<string>();

    dbMeetingDates.forEach((row) => {
        const allAvailabilities = row;
        console.log("Meeting dates: ", row);
        for (const date in allAvailabilities) {
            dates.add(date);
        }
    });

    return Array.from(dates).sort((a, b) => (a < b ? -1 : 1));
};

// TODO (#auth): Replace `user` with User type
export const getAvailability = async ({
    userId,
    meetingId,
}: {
    userId: string;
    meetingId: string;
}): Promise<AvailabilityMeetingDateJoinSchema[]> => {
    const availability = await db
        .select({
            meetingAvailabilities: availabilities.meetingAvailabilities,
        })
        .from(availabilities)
        .where(
            and(
                eq(availabilities.memberId, userId),
                eq(availabilities.meetingId, meetingId)
            )
        );

    return availability;
};
