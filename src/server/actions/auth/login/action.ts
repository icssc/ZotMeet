"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users } from "@/db/schema";
import { setSessionTokenCookie } from "@/lib/auth/cookies";
import { verifyPasswordHash } from "@/lib/auth/password";
import { createSession, generateSessionToken } from "@/lib/auth/session";
import { getUserPasswordHash } from "@/lib/auth/user";
import { loginFormSchema } from "@actions/auth/login/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export type LoginFormState = {
    message: string;
    error: boolean;
};

export default async function loginAction(
    payload: z.infer<typeof loginFormSchema>
): Promise<LoginFormState> {
    // TODO: add rate limit + throttling

    const parsed = loginFormSchema.safeParse(payload);

    if (!parsed.success) {
        return {
            error: true,
            message: parsed.error.message,
        };
    }

    const { email, password } = parsed.data;

    const [existingUser] = await db
        .select({
            id: users.id,
        })
        .from(users)
        .where(eq(users.email, email));

    if (!existingUser) {
        return {
            error: true,
            message: "User does not exist",
        };
    }

    const passwordHash = await getUserPasswordHash(existingUser.id);
    const isValidPassword = await verifyPasswordHash(passwordHash, password);

    if (!isValidPassword) {
        return {
            error: true,
            message: "Invalid password",
        };
    }

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);

    setSessionTokenCookie(sessionToken, session.expiresAt);

    revalidatePath("/", "layout");

    return {
        error: false,
        message: "hi",
    };
}
