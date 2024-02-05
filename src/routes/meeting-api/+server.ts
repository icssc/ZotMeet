import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST({ request }: { request: Request }) {
  const body = await request.json();

  try {
    // Update a meeting in the database
    const updatedMeeting = await prisma.meeting.create({
      data: {
        title: body.title,
        description: body.description,
        startTime: body.startTime,
        endTime: body.endTime,
        location: body.location,
        hostId: body.hostId,
        created_at: Math.floor(Date.now() / 1000),
      },
    });
    return new Response(
      JSON.stringify({ message: "Meeting was updated successfully", updatedMeeting }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("error", error);
    return new Response(JSON.stringify({ error: "Failed to create the meeting" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
