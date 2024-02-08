import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async (event) => {
  const user = event.locals.user;

  return {
    groups: await prisma.groups.findMany({
      where: {
        members: {
          some: {
            userId: user.userId,
          },
        },
      },
    }),
  };
};

export const actions: Actions = {
  createGroup: createGroup,
};

async function createGroup({ request, locals }: { request: Request; locals: App.Locals }) {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, "/");
  }

  const { name, description } = Object.fromEntries(await request.formData()) as Record<
    string,
    string
  >;

  try {
    await prisma.groups.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId: session.user.userId,
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
    return fail(500, { message: "Could not create group." });
  }

  return {
    status: 201,
  };
}
