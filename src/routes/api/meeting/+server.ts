import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST({ request }: { request: Request }) {
  const data = await request.json();

  console.log(request);

  try {
    await prisma.meeting.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        from_time: new Date(data.from_time),
        to_time: new Date(data.to_time),
        host_id: data.host_id,
        location: data.location,
      },
    });
  } catch (error) {
    console.error("error", error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify({ message: "Success" }), { status: 201 });
}
