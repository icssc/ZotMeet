import "server-only";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserIdExists(id: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, id),
    });

    return user !== undefined;
}

export async function getUserEmailExists(email: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    return user !== undefined;
}

export async function getUserFromGoogleId(googleId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, googleId),
    });

    return user !== undefined;
}