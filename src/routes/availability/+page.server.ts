import type { Actions } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { User } from "lucia";
import { superValidate } from "sveltekit-superforms/server";

import { _loginSchema } from "../auth/login/+page.server";

import type { PageServerLoad } from "./$types";

import { guestSchema } from "$lib/config/zod-schemas";
import { db } from "$lib/db/drizzle";
import {
  availabilities,
  meetings,
  meetingDates,
  type AvailabilityInsertSchema,
  type MeetingSelectSchema,
  type MeetingDateSelectSchema,
} from "$lib/db/schema";
import type { ZotDate } from "$lib/utils/ZotDate";

const guestLoginSchema = guestSchema.pick({ username: true });

export const load = (async ({ locals }) => {
  const user = locals.user;

  return {
    form: await superValidate(_loginSchema),
    guestForm: await superValidate(guestLoginSchema),
    availability: user ? await getAvailability(user) : null,
  };
}) satisfies PageServerLoad;

const getAvailability = async (user: User) => {
  const availability = await db
    .select()
    .from(availabilities)
    .where(eq(availabilities.member_id, user.id));

  return availability;
};

export const actions: Actions = {
  saveAvailabilities: saveAvailabilities,
};

async function saveAvailabilities({ request, locals }: { request: Request; locals: App.Locals }) {
  const user: User | null = locals.user;

  if (!user) {
    return {
      status: 403,
      body: {
        error: "Authentication required",
      },
    };
  }

  const formData = await request.formData();
  const availabilityDates: ZotDate[] = JSON.parse(
    (formData.get("availabilityDates") as string) ?? "",
  );

  let dbMeetingDates: MeetingDateSelectSchema[] = [];

  try {
    dbMeetingDates = await getMeetingDates();
  } catch (e) {
    console.log("Error getting meeting dates:", e);
  }

  if (!dbMeetingDates || dbMeetingDates.length === 0) return;

  try {
    for (let i = 0; i < availabilityDates.length; i++) {
      const date = availabilityDates[i];

      const availability: AvailabilityInsertSchema = {
        day: new Date(date.day).toISOString(),
        member_id: user.id,
        meeting_day: dbMeetingDates[i].id as string, // Type-cast since id is guaranteed if a meetingDate exists
        availability_string: date.availability.toString(),
      };

      await db.insert(availabilities).values(availability);
      // .onConflictDoUpdate({
      //   target: [availabilities.member_id, availabilities.meeting_day],
      //   set: { availability_string: availability.availability_string },
      // });
    }

    console.log("success!");
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

// Used to access test meeting
async function getMeeting(): Promise<MeetingSelectSchema> {
  const testMeeting = await db.select().from(meetings).where(eq(meetings.title, "default"));

  return testMeeting[0];
}

// Used to access test meeting dates of test meeting
async function getMeetingDates(): Promise<MeetingDateSelectSchema[]> {
  const testMeeting = await getMeeting();
  const testMeetingDates = await db
    .select()
    .from(meetingDates)
    .where(eq(meetingDates.meeting_id, testMeeting.id));

  return testMeetingDates;
}
