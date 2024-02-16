import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async (event) => {
  const user = event.locals.user;

  if (!user) {
    throw redirect(302, "/auth");
  }

  return {
    groups: await prisma.groups.findMany({
      where: {
        members: {
          some: {
            userId: user.userId, // TODO: There probably should be an "owner" of a group
          },
        },
      },
    }),
  };
};

export const actions: Actions = {
  createGroup: createGroup,
  deleteGroup: deleteGroup,
};

async function createGroup({ request, locals }: { request: Request; locals: App.Locals }) {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, "/auth");
  }

  const { name, description } = Object.fromEntries(await request.formData()) as {
    name: string;
    description: string;
  };

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

async function deleteGroup({ url, locals }: { url: URL; locals: App.Locals }) {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, "/");
  }

  const id = url.searchParams.get("id");
  if (!id) {
    return fail(400, { message: "Invalid request, could not delete group" });
  }

  try {
    await prisma.groups.delete({
      where: {
        id: id,
      },
    });
  } catch (err) {
    console.error(err);
    return fail(500, { message: "Could not delete group." });
  }

  return {
    status: 201,
  };
}
