import type { User } from "@prisma/client";

export const load = async (event: { locals: { user: User } }) => {
  return { user: event.locals.user };
};
