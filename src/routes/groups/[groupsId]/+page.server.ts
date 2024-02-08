import { error, fail } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async ({ params }) => {
  const getGroup = async () => {
    const group = await prisma.groups.findUnique({
      where: {
        id: params.groupsId,
      },
    });
    if (!group) {
      throw error(404, "Group not found");
    }
    return group;
  };

  return {
    group: getGroup(),
  };
};

export const actions: Actions = {
  updateGroup: updateGroup,
};

async function updateGroup({
  request,
  params,
}: {
  request: Request;
  params: { groupsId: string };
}) {
  const { name, description } = Object.fromEntries(await request.formData()) as {
    name: string;
    description: string;
  };

  try {
    await prisma.groups.update({
      where: {
        id: params.groupsId,
      },
      data: {
        name,
        description,
      },
    });
  } catch (err) {
    console.error(err);
    return fail(500, { message: "Could not update group" });
  }

  return {
    status: 200,
  };
}
