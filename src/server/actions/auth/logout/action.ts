"use server";

import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/auth";
import { deleteSessionTokenCookie } from "@/lib/auth/cookies";
import { invalidateSession } from "@/lib/auth/session";

export async function logoutAction() {
    const { session } = await getCurrentSession();

    if (session === null) {
        return {
            message: "Not authenticated",
        };
    }

    invalidateSession(session.id);
    deleteSessionTokenCookie();

    try {
        await fetch(`${process.env.OAUTH_ISSUER_URL}/logout`, {
            method: "POST",
            credentials: "include",
        });
    } catch (error) {
        console.error("Failed to invalidate IdP session:", error);
    }

    revalidatePath("/", "layout");
}
