import type { RequestHandler } from "@sveltejs/kit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { db } from "$lib/db/drizzle";

// Below is a boilerplate template for defining Svelte route APIs
export const GET: RequestHandler = async ({ request }) => {
  const example = await request.json();
  return new Response(example);
};

export const POST: RequestHandler = async ({ request }) => {
  const example = await request.json();
  return new Response(example);
};

export const PUT: RequestHandler = async ({ request }) => {
  const example = await request.json();
  return new Response(example);
};

export const DELETE: RequestHandler = async ({ request }) => {
  const example = await request.json();
  return new Response(example);
};
