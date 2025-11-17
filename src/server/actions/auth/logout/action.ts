"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

    revalidatePath("/", "layout");

    const logoutUrl = new URL(`${process.env.OIDC_ISSUER_URL}/logout`);
    logoutUrl.searchParams.set(
        "redirect_to",
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    );

    redirect(logoutUrl.toString());
}
