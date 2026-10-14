import { z } from "zod";

/**
 * Invites by email address, for people who may not have a ZotMeet account
 * yet. The server resolves each address: a registered user gets the normal
 * invite, anyone else gets the invite email only.
 */

/** Cap per request; every unregistered address costs an outbound email. */
export const MAX_INVITE_EMAILS = 20;

/** Trimmed and lower-cased so the same address can't be invited twice. */
export const inviteEmailSchema = z.string().trim().toLowerCase().email();

export const inviteEmailsSchema = z
	.array(inviteEmailSchema)
	.max(
		MAX_INVITE_EMAILS,
		`You can invite up to ${MAX_INVITE_EMAILS} people by email at a time.`,
	)
	.transform((emails) => [...new Set(emails)]);

/** The normalized address, or `null` when `value` isn't a valid email. */
export function parseInviteEmail(value: string): string | null {
	const parsed = inviteEmailSchema.safeParse(value);
	return parsed.success ? parsed.data : null;
}
