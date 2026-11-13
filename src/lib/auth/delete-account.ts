import { eq } from "drizzle-orm";
import { db } from "@/db";
import { groups, members } from "@/db/schema";

export {
	DELETE_ACCOUNT_CONFIRM_PHRASE,
	isApplePrivateRelayEmail,
	isDeleteConfirmationValid,
} from "@/lib/auth/delete-account-confirm";

export async function deleteAccountData(
	userId: string,
	memberId: string,
): Promise<void> {
	await db.transaction(async (tx) => {
		await tx
			.update(groups)
			.set({ createdBy: null })
			.where(eq(groups.createdBy, userId));
		await tx.delete(members).where(eq(members.id, memberId));
	});
}
