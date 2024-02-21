import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
