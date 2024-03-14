import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST({ request }: { request: Request }) {
  const data = await request.json();

  try {
    await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        created_at: new Date(),
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

  console.log(data);

  return new Response(JSON.stringify({ message: "Success" }), { status: 201 });
}
