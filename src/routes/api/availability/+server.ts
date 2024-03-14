import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST({ request }: { request: Request }) {
  const data = await request.json();

  try {
    const newAvailability = await prisma.availability.create({
      data: {
        from_time: data.from_time,
        to_time: data.to_time,
        from_date: data.from_date,
        to_date: data.to_date,
      },
    });

    return new Response(
      JSON.stringify({ message: "Success", availabilityId: newAvailability.id }),
      { status: 201 },
    );
  } catch (error) {
    console.error("error", error);
    return new Response(JSON.stringify({ error: "Failed to create availability" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
