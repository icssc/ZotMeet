export const DELETE_ACCOUNT_CONFIRM_PHRASE = "DELETE";

export function isDeleteConfirmationValid(phrase: string): boolean {
	return phrase.trim() === DELETE_ACCOUNT_CONFIRM_PHRASE;
}

const APPLE_PRIVATE_RELAY_DOMAIN = "privaterelay.appleid.com";

function emailDomain(email: string): string | null {
	const trimmed = email.trim().toLowerCase();
	const at = trimmed.lastIndexOf("@");
	if (at <= 0 || at === trimmed.length - 1) {
		return null;
	}
	return trimmed.slice(at + 1);
}

export function isApplePrivateRelayEmail(email: string): boolean {
	return emailDomain(email) === APPLE_PRIVATE_RELAY_DOMAIN;
}
