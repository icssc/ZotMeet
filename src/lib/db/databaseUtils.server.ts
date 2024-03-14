import { eq } from "drizzle-orm";

import { db } from "./drizzle";
import { users, type UserInsertSchema } from "./schema";

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
