"use server";

import { signupFormSchema } from "@actions/auth/signup/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { setSessionTokenCookie } from "@/lib/auth/cookies";
import { createSession, generateSessionToken } from "@/lib/auth/session";
import { createUser } from "@/lib/auth/user";

export type SignupFormState = {
	message: string;
	error: boolean;
};

export default async function signupAction(
	payload: z.infer<typeof signupFormSchema>,
): Promise<SignupFormState> {
	const parsed = signupFormSchema.safeParse(payload);

	if (!parsed.success) {
		return {
			error: true,
			message: parsed.error.message,
		};
	}

	const { email, password, displayName } = parsed.data;

	const [existingUser] = await db
		.select({
			id: users.id,
		})
		.from(users)
		.where(eq(users.email, email));

	if (existingUser) {
		return {
			error: true,
			message: "User already exists",
		};
	}

	// TODO: add email verification

	const newUser = await createUser(email, displayName, password);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, newUser.id);

	setSessionTokenCookie(sessionToken, session.expiresAt);

	revalidatePath("/", "layout");

	return {
		error: false,
		message: "Success",
	};
}
