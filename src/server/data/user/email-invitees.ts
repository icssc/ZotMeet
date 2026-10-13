import "server-only";

import { sendEmail } from "@/lib/email/send-email";
import type { createBrandedTransactionalEmail } from "@/lib/email/templates";
import { isUciEmail } from "@/server/data/user/directory";
import { getUsersByEmails } from "@/server/data/user/queries";

/**
 * Splits invitee emails (picked from the UCI directory) into people who
 * already have a ZotMeet account and people who don't. Non-UCI addresses are
 * dropped.
 */
export async function resolveInviteEmails(
	emails: string[],
): Promise<{ userIds: string[]; newEmails: string[] }> {
	const normalized = [
		...new Set(emails.map((e) => e.trim().toLowerCase())),
	].filter(isUciEmail);
	if (normalized.length === 0) return { userIds: [], newEmails: [] };

	const existing = await getUsersByEmails(normalized);
	const existingEmails = new Set(existing.map((u) => u.email.toLowerCase()));

	return {
		userIds: existing.map((u) => u.id),
		newEmails: normalized.filter((e) => !existingEmails.has(e)),
	};
}

/** Emails people without an account. Returns how many sends failed. */
export async function sendInviteEmails(
	emails: string[],
	email: ReturnType<typeof createBrandedTransactionalEmail>,
): Promise<number> {
	const results = await Promise.allSettled(
		emails.map((to) => sendEmail({ to, ...email })),
	);

	const failures = results.filter((r) => r.status === "rejected");
	for (const failure of failures) {
		console.error("Failed to send invite email:", failure.reason);
	}
	return failures.length;
}
