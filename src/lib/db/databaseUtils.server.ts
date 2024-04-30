import { and, eq } from "drizzle-orm";
import type { SuperValidated } from "sveltekit-superforms";
import type { ZodObject, ZodString } from "zod";

import { db } from "./drizzle";
import { members, users, guests, meetings } from "./schema";
import type {
  UserInsertSchema,
  MemberInsertSchema,
  MeetingSelectSchema,
  GuestInsertSchema,
  MeetingInsertSchema,
} from "./schema";

import type { AlertMessageType } from "$lib/types/auth";

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
  meeting: MeetingSelectSchema,
) => {
  const result = await db
    .select()
    .from(guests)
    .where(and(eq(guests.username, username), eq(guests.meeting_id, meeting.id)));

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

export const getExistingUser = async (
  form: SuperValidated<ZodObject<{ email: ZodString }>, AlertMessageType>,
) => {
  const [existingUser] = await db
    .select({
      id: users.id,
      email: users.email,
      password: users.password,
      // authMethods: users.authMethods,
    })
    .from(users)
    .where(eq(users.email, form.data.email as string));

  return existingUser;
};

export const getExistingGuest = async (username: string, meeting: MeetingSelectSchema) => {
  const [existingGuest] = await db
    .select()
    .from(guests)
    .where(and(eq(guests.username, username), eq(guests.meeting_id, meeting.id)));

  return existingGuest;
};

/**
 * To create a meeting, call this function with:
 * 1. A title
 * 2. A start time; I used: 2024-01-31T16:00:00.000Z
 * 3. An end time: I used: 2024-02-06T16:00:00.000Z
 *
 * NOTE:
 * `generateSampleDates()` is called whenever no availability is found
 * If you use dates other than the ones above, generateSampleDates() will return dates
 * other than the ones your meeting may *actually* be of
 *
 * @param meeting
 */
export const createMeeting = async (meeting: MeetingInsertSchema) => {
  await db.insert(meetings).values(meeting);
};
