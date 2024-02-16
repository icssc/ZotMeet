import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async (event) => {
  const user = event.locals.user;

  return user ?? null;
};

export const actions: Actions = {
  updateUser: updateUser,
  deleteUser: deleteUser,
};

async function updateUser({ request, locals }: { request: Request; locals: App.Locals }) {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, "/");
  }

  const { firstName, lastName } = Object.fromEntries(await request.formData()) as {
    firstName: string;
    lastName: string;
  };

  try {
    await prisma.user.update({
      where: {
        id: session.user.userId,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
      },
    });
  } catch (err) {
    console.error(err);
    return fail(500, { message: "Could not update user." });
  }

  return {
    status: 200,
  };
}

async function deleteUser({ locals }: { locals: App.Locals }) {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, "/");
  }

  try {
    await prisma.user.delete({
      where: {
        id: session.user.userId,
      },
    });
  } catch (err) {
    console.error(err);
    return fail(500, { message: "Could not delete user." });
  }

  throw redirect(300, "/auth");
}
