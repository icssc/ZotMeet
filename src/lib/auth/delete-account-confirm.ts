export const DELETE_ACCOUNT_CONFIRM_PHRASE = "DELETE";

export function isDeleteConfirmationValid(phrase: string): boolean {
	return phrase.trim() === DELETE_ACCOUNT_CONFIRM_PHRASE;
}

export function isApplePrivateRelayEmail(email: string): boolean {
	return email.toLowerCase().includes("@privaterelay.appleid.com");
}
