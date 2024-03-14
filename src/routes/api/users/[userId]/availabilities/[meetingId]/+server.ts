import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "@sveltejs/kit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { db } from "$lib/db/drizzle";

const prisma = new PrismaClient();

// Below is a boilerplate template for defining Svelte route APIs
export const GET: RequestHandler = async ({ request }) => {
  const example = await request.json();
  return new Response(example);
};

export async function POST({ request }: { request: Request }) {
  const data = await request.json();

  try {
    const newMeetingUserAvailability = await prisma.meetingUserAvailability.create({
      data: {
        meetingId: data.meetingId,
        userId: data.userId,
        availabilityId: data.availabilityId,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Success",
        meetingUserAvailabilityId: newMeetingUserAvailability.id,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("error", error);
    return new Response(JSON.stringify({ error: "Failed to create meeting user availability" }), {
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
