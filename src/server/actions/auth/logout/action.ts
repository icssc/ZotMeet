"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { deleteSessionTokenCookie } from "@/lib/auth/cookies";
import { getOidcLogoutUrl } from "@/lib/auth/oidc-logout";
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

	redirect(getOidcLogoutUrl("/"));
}
