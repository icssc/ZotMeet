import type { Actions } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";
import type { User } from "lucia";
import { superValidate } from "sveltekit-superforms/server";

import type { PageServerLoad } from "../$types";
import { _loginSchema } from "../../auth/login/+page.server";

import { guestSchema } from "$lib/config/zod-schemas";
import { getExistingGuest } from "$lib/db/databaseUtils.server";
import { db } from "$lib/db/drizzle";
import {
  availabilities,
  meetings,
  meetingDates,
  type AvailabilityInsertSchema,
  type MeetingSelectSchema,
  type MeetingDateSelectSchema,
  users,
} from "$lib/db/schema";
import type { ZotDate } from "$lib/utils/ZotDate";

const guestLoginSchema = guestSchema.pick({ username: true });

export const load: PageServerLoad = (async ({ locals, params }) => {
  const user = locals.user;
  // @ts-expect-error slug is defined in the route
  const meeting_id: string = params?.slug;

  return {
    form: await superValidate(_loginSchema),
    guestForm: await superValidate(guestLoginSchema),
    availability: user ? await getAvailability(user, meeting_id) : null,
    groupAvailabilities: await getAvailabilities(meeting_id),
    meetingId: meeting_id as string | undefined,
    defaultDates: (await getMeetingDates(meeting_id)) ?? [],
  };
}) satisfies PageServerLoad;

const getAvailability = async (user: User, meetingId: string | undefined) => {
  const availability = await db
    .select()
    .from(availabilities)
    .innerJoin(meetingDates, eq(availabilities.meeting_day, meetingDates.id))
    .where(
      and(eq(availabilities.member_id, user.id), eq(meetingDates.meeting_id, meetingId ?? "")),
    );

  return availability.map((item) => item.availabilities).sort((a, b) => (a.day < b.day ? -1 : 1));
};

/**
 * Get all availabilities of members for a meeting
 *
 * @param meetingId
 * @returns a record of the member name to their availabilities, each sorted by date
 */
async function getAvailabilities(meetingId: string) {
  const raw_availabilities = await db
    .select({
      username: users.displayName,
      availability_string: availabilities.availability_string,
      day: meetingDates.date,
    })
    .from(availabilities)
    .innerJoin(meetingDates, eq(availabilities.meeting_day, meetingDates.id))
    .innerJoin(meetings, eq(meetingDates.meeting_id, meetings.id))
    .innerJoin(users, eq(availabilities.member_id, users.id))
    .where(eq(meetings.id, meetingId));

  // Group availabilities by user
  const userAvailabilities = raw_availabilities.reduce(
    (acc, { username, availability_string, day }) => {
      if (!acc[username]) {
        acc[username] = [];
      }

      acc[username].push({ day, availability_string });

      return acc;
    },
    {} as Record<string, { day: Date; availability_string: string }[]>,
  );

  // Sort availabilities by date
  for (const username in userAvailabilities) {
    userAvailabilities[username].sort((a, b) => (a.day < b.day ? -1 : 1));
  }

  return userAvailabilities;
}

export const actions: Actions = {
  save: save,
};

async function save({ request, locals }: { request: Request; locals: App.Locals }) {
  const user: User | null = locals.user;

  const formData = await request.formData();
  const availabilityDates: ZotDate[] = JSON.parse(
    (formData.get("availabilityDates") as string) ?? "[]",
  );
  const meetingId = (formData.get("meetingId") as string) ?? "";

  let dbMeetingDates: MeetingDateSelectSchema[] = [];

  try {
    dbMeetingDates = await getMeetingDates(meetingId);
  } catch (e) {
    console.log("Error getting meeting dates:", e);
  }

  if (!dbMeetingDates || dbMeetingDates.length === 0) return;

  try {
    const memberId =
      user?.id ??
      (await getExistingGuest(formData.get("username") as string, await _getMeeting(meetingId))).id;

    const insertDates: AvailabilityInsertSchema[] = availabilityDates.map((date, index) => ({
      day: new Date(date.day).toISOString(),
      member_id: memberId,
      meeting_day: dbMeetingDates[index].id as string, // Type-cast since id is guaranteed if a meetingDate exists
      availability_string: date.availability.toString(),
    }));

    await db.transaction(async (tx) => {
      await tx
        .insert(availabilities)
        .values(insertDates)
        .onConflictDoUpdate({
          target: [availabilities.member_id, availabilities.meeting_day],
          set: {
            availability_string: sql.raw(`excluded.availability_string`), // `excluded` refers to the row currently in conflict
          },
        });
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

export async function _getMeeting(meetingId: string): Promise<MeetingSelectSchema> {
  const [meeting] = await db.select().from(meetings).where(eq(meetings.id, meetingId));

  return meeting;
}

async function getMeetingDates(meetingId: string): Promise<MeetingDateSelectSchema[]> {
  const dbMeeting = await _getMeeting(meetingId);
  const dbMeetingDates = await db
    .select()
    .from(meetingDates)
    .where(eq(meetingDates.meeting_id, dbMeeting.id));

  return dbMeetingDates.sort((a, b) => (a.date < b.date ? -1 : 1));
}
