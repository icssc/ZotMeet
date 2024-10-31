import { db } from "@/db";
import {
    GuestInsertSchema,
    guests,
    MeetingDateInsertSchema,
    meetingDates,
    MeetingInsertSchema,
    meetings,
    MeetingSelectSchema,
    MemberInsertSchema,
    members,
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

export const checkIfGuestUsernameExists = async (
    username: string,
    meeting: MeetingSelectSchema
) => {
    const result = await db
        .select()
        .from(guests)
        .where(
            and(
                eq(guests.username, username),
                eq(guests.meeting_id, meeting.id)
            )
        );

    return result.length > 0;
};

export const insertNewMember = async (member: MemberInsertSchema) => {
    return await db.insert(members).values(member);
};

export const insertNewUser = async (user: UserInsertSchema) => {
    return await db.insert(users).values(user);
};

export const insertNewGuest = async (guest: GuestInsertSchema) => {
    return await db.insert(guests).values(guest);
};

export const getAllUsers = async () => {
    const queryResult = await db
        .select({
            id: users.id,
            displayName: users.displayName,
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

export const getExistingGuest = async (
    username: string,
    meeting: MeetingSelectSchema
) => {
    const [existingGuest] = await db
        .select()
        .from(guests)
        .where(
            and(
                eq(guests.username, username),
                eq(guests.meeting_id, meeting.id)
            )
        );

    return existingGuest;
};

/**
 * @param meeting The meeting object to insert. `from_time` and `to_time` represent the start and end times
 * and are only used for the times of day.
 * @param meetingDates The dates to insert for the meeting. Only the date portion of the date object is used.
 * @returns The id of the inserted meeting.
 */
export const insertMeeting = async (
    meeting: MeetingInsertSchema,
    meetingDates: Date[]
) => {
    const [dbMeeting] = await db.insert(meetings).values(meeting).returning();
    await insertMeetingDates(meetingDates, dbMeeting.id);
    return dbMeeting.id;
};

export const getExistingMeeting = async (meetingId: string) => {
    const [dbMeeting] = await db
        .select()
        .from(meetings)
        .where(eq(meetings.id, meetingId));

    return dbMeeting;
};

export const insertMeetingDates = async (dates: Date[], meeting_id: string) => {
    const dbMeetingDates: MeetingDateInsertSchema[] = dates.map((date) => {
        // Get the start of the date to better standardize
        const startOfDay = new Date(date.toDateString());
        return { meeting_id, date: startOfDay };
    });

    await db.insert(meetingDates).values(dbMeetingDates);
};

export const getExistingMeetingDates = async (meetingId: string) => {
    const dbMeetingDates = await db
        .select()
        .from(meetingDates)
        .where(eq(meetingDates.meeting_id, meetingId));

    return dbMeetingDates;
};
