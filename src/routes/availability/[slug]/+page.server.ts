import type { Actions } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";
import type { User } from "lucia";
import { superValidate } from "sveltekit-superforms/server";

import type { PageServerLoad } from "../$types";
import { _loginSchema } from "../../auth/login/+page.server";

import { getExistingGuest, getExistingMeeting } from "$lib/db/databaseUtils.server";
import { db } from "$lib/db/drizzle";
import {
  availabilities,
  meetingDates,
  membersInMeeting,
  type AvailabilityInsertSchema,
  type AvailabilityMeetingDateJoinSchema,
  type MeetingDateSelectSchema,
} from "$lib/db/schema";
import type { ZotDate } from "$lib/utils/ZotDate";

export const load: PageServerLoad = (async ({ locals, params }) => {
  const user = locals.user;

  // TODO: If no slug is in the URL (i.e. no meeting ID), we should redirect to an error page

  return {
    form: await superValidate(_loginSchema),
    availability: user ? await getAvailability(user, params?.slug) : null,
    meetingId: params?.slug as string | undefined,
    meetingData: await getExistingMeeting(params?.slug),
    defaultDates: (await _getMeetingDates(params?.slug)) ?? [],
  };
}) satisfies PageServerLoad;

const getAvailability = async (
  user: User,
  meetingId: string | undefined,
): Promise<AvailabilityMeetingDateJoinSchema[]> => {
  const availability = await db
    .select()
    .from(availabilities)
    .innerJoin(meetingDates, eq(availabilities.meeting_day, meetingDates.id))
    .where(
      and(eq(availabilities.member_id, user.id), eq(meetingDates.meeting_id, meetingId ?? "")),
    );

  return availability.sort((a, b) => (a.meeting_dates.date > b.meeting_dates.date ? 1 : -1));
};

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
    dbMeetingDates = await _getMeetingDates(meetingId);
  } catch (e) {
    console.log("Error getting meeting dates:", e);
  }

  if (!dbMeetingDates || dbMeetingDates.length === 0) return;

  try {
    const memberId =
      user?.id ??
      (
        await getExistingGuest(
          formData.get("username") as string,
          await getExistingMeeting(meetingId),
        )
      ).id;

    const insertDates: AvailabilityInsertSchema[] = availabilityDates.map((date, index) => ({
      day: new Date(date.day).toISOString(),
      member_id: memberId,
      meeting_day: dbMeetingDates[index].id as string, // Type-cast since id is guaranteed if a meetingDate exists
      availability_string: date.availability.map((bool) => (bool ? "1" : "0")).join(""),
    }));

    await db.transaction(async (tx) => {
      await Promise.all([
        tx
          .insert(availabilities)
          .values(insertDates)
          .onConflictDoUpdate({
            target: [availabilities.member_id, availabilities.meeting_day],
            set: {
              // `excluded` refers to the row currently in conflict
              availability_string: sql.raw(`excluded.availability_string`),
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

export async function _getMeetingDates(meetingId: string): Promise<MeetingDateSelectSchema[]> {
  const dbMeeting = await getExistingMeeting(meetingId);
  const dbMeetingDates = await db
    .select()
    .from(meetingDates)
    .where(eq(meetingDates.meeting_id, dbMeeting.id));

  return dbMeetingDates.sort((a, b) => (a.date < b.date ? -1 : 1));
}
