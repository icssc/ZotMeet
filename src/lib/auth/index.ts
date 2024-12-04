import { cache } from "react";
import { cookies } from "next/headers";
import {
    SessionValidationResult,
    validateSessionToken,
} from "@/lib/auth/session";

// Uses React cache to de-dupe calls to check the current session, per request.
// To be used in server components, server actions, and route handlers (but not on front-end or middleware).
export const getCurrentSession = cache(
    async (): Promise<SessionValidationResult> => {
        const token = cookies().get("session")?.value ?? null;

        if (token === null) {
            return { session: null, user: null };
        }

        const result = await validateSessionToken(token);

        return result;
    }
);
