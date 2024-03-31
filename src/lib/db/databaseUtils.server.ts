import { eq } from "drizzle-orm";
import type { SuperValidated } from "sveltekit-superforms";
import type { ZodObject, ZodString } from "zod";

import { db } from "./drizzle";
import { users, type UserInsertSchema } from "./schema";

import type { AlertMessageType } from "$lib/types/auth";

export const checkIfIdExists = async (id: string) => {
  const queryResult = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.id, id));

  return queryResult.length > 0;
};

export const checkIfEmailExists = async (email: string) => {
  const queryResult = await db
    .select({
      email: users.email,
    })
    .from(users)
    .where(eq(users.email, email));

  return queryResult.length > 0;
};

export const insertNewUser = async (user: UserInsertSchema) => {
  return await db.insert(users).values(user);
};

export const getAllUsers = async () => {
  const queryResult = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      email: users.email,
    })
    .from(users);

  return queryResult;
};

export const getExistingUser = async (
  form: SuperValidated<ZodObject<{ email: ZodString }>, AlertMessageType>,
) => {
  const [existingUser] = await db
    .select({
      id: users.id,
      email: users.email,
      password: users.password,
      // authMethods: users.authMethods,
    })
    .from(users)
    .where(eq(users.email, form.data.email as string));

  return existingUser;
};
