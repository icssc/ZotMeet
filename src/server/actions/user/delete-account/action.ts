"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { deleteSessionTokenCookie } from "@/lib/auth/cookies";
import { deleteAccountData } from "@/lib/auth/delete-account";
import { isDeleteConfirmationValid } from "@/lib/auth/delete-account-confirm";
import { getOidcLogoutUrl } from "@/lib/auth/oidc-logout";

export type DeleteAccountState = {
	success: false;
	message: string;
};

export async function deleteAccountAction(
	confirmPhrase: string,
): Promise<DeleteAccountState | void> {
	const { session, user } = await getCurrentSession();
	if (session === null || user === null) {
		return {
			success: false,
			message: "Not authenticated",
		};
	}

	if (!isDeleteConfirmationValid(confirmPhrase)) {
		return {
			success: false,
			message: 'Type "DELETE" to confirm account deletion.',
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

	await deleteSessionTokenCookie();

	revalidatePath("/", "layout");
	redirect(getOidcLogoutUrl("/auth/login/deleted"));
}
