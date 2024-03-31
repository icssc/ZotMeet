export async function POST({ request }: { request: Request }) {
  const data = await request.json();

  try {
    // Update with the code neccesary to update the meetings table via drizzle

    console.log(data, request); // pass lint errors
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
