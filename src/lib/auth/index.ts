import { cache } from "react";
import { cookies } from "next/headers";
import {
	SessionValidationResult,
	validateSessionToken,
} from "@/lib/auth/session";

// Uses React cache to de-dupe calls to check the current session, per request.
// To be used in server components, server actions, and route handlers (but not on front-end or middleware).
// This is a server-only function, so it can access the cookies directly.
/**
 * Gets the current session of a user.
 *
 * @returns A promise that resolves to a SessionValidationResult object if the user is logged in, or null if the session is invalid.
 */
export const getCurrentSession = cache(
	async (): Promise<SessionValidationResult> => {
		const token = (await cookies()).get("session")?.value ?? null;

		if (token === null) {
			return { session: null, user: null };
		}

		const result = await validateSessionToken(token);

		return result;
	},
);
