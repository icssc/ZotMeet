import { eq } from "drizzle-orm";
import { db } from "@/db";
import { groups, members } from "@/db/schema";

export function emailsMatch(
	confirmEmail: string,
	accountEmail: string,
): boolean {
	return (
		confirmEmail.trim().toLowerCase() === accountEmail.trim().toLowerCase()
	);
}

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
