import type { RequestHandler } from "@sveltejs/kit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { db } from "$lib/db/drizzle";
import { meetings, meetingDates } from "$lib/db/schema";
// Below is a boilerplate template for defining Svelte route APIs
export const GET: RequestHandler = async ({ request }) => {
  const example = await request.json();

  return new Response(example);
};

export async function POST({ request }: { request: Request }) {
  const { data } = await request.json();

  console.log(request);

  try {
    const createdMeetings = await db
      .insert(meetings)
      .values({
        title: data.title,
        description: data?.description,
        location: data?.location,
        scheduled: false,
        from_time: data.from_time,
        to_time: data.to_time,
        group_id: data.group_id,
        host_id: data.host_id,
      })
      .returning();
    const createdMeeting = createdMeetings[0];

    const newMeetingDates = data.dates.map((date: Date) => ({
      meeting_id: createdMeeting.id,
      date,
    }));
    const createdDates = await db
      .insert(meetingDates)
      .values(newMeetingDates)
      .returning({ date: meetingDates.date });
    const finalDates = createdDates.map(({ date }: { date: Date }) => date);
    const resObject = JSON.stringify({ ...createdMeeting, dates: finalDates });
    return new Response(JSON.stringify(resObject), { status: 201 });
  } catch (error) {
    console.error("error", error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
export const PUT: RequestHandler = async ({ request }) => {
  const example = await request.json();
  return new Response(example);
};

export const DELETE: RequestHandler = async ({ request }) => {
  const example = await request.json();
  return new Response(example);
};
