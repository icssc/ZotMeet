"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { deleteSessionTokenCookie } from "@/lib/auth/cookies";
import { deleteAccountData, emailsMatch } from "@/lib/auth/delete-account";
import { invalidateSession } from "@/lib/auth/session";

export type DeleteAccountState = {
	success: false;
	message: string;
};

export async function deleteAccountAction(
	confirmEmail: string,
): Promise<DeleteAccountState | void> {
	const { session, user } = await getCurrentSession();
	if (session === null || user === null) {
		return {
			success: false,
			message: "Not authenticated",
		};
	}

	if (!emailsMatch(confirmEmail, user.email)) {
		return {
			success: false,
			message: "Email does not match your account.",
		};
	}

	try {
		await deleteAccountData(user.id, user.memberId);
	} catch (error) {
		console.error("Failed to delete account:", error);
		return {
			success: false,
			message: "Failed to delete account. Please try again.",
		};
	}

	await invalidateSession(session.id);
	await deleteSessionTokenCookie();
	revalidatePath("/", "layout");
	redirect("/auth/login?deleted=1");
}
