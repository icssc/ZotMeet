import { NOTIFICATION_TYPES } from "@/lib/notification/types";

function isHttpUrl(redirect: string): boolean {
	return redirect.startsWith("http://") || redirect.startsWith("https://");
}

function toAppPath(redirect: string): string {
	if (isHttpUrl(redirect)) {
		try {
			const url = new URL(redirect);
			return `${url.pathname}${url.search}${url.hash}` || "/summary";
		} catch {
			return "/summary";
		}
	}
	return redirect.startsWith("/") ? redirect : "/summary";
}

/** Bare invite tokens are stored without a leading slash. */
function looksLikeInviteToken(redirect: string): boolean {
	return !redirect.startsWith("/") && !isHttpUrl(redirect);
}

/**
 * App-relative path used in APNs/SNS payloads and native tap handling.
 * In-app notification rows may still store full URLs or invite tokens.
 *
 * When `type` is omitted (legacy or partial FCM payloads), infers the path from
 * `redirect` shape (e.g. `/availability/…`, `/invite/…`, or a bare invite token).
 */
export function normalizePushRedirect(
	type: string | undefined,
	redirect: string,
): string {
	const trimmed = redirect.trim();
	if (!trimmed) return "/summary";

	if (type === NOTIFICATION_TYPES.GROUP_INVITE) {
		if (trimmed.startsWith("/invite/")) return trimmed;
		if (trimmed.startsWith("/")) return trimmed;
		return `/invite/${encodeURIComponent(trimmed)}`;
	}

	if (!type) {
		if (
			trimmed.startsWith("/invite/") ||
			trimmed.startsWith("/availability/")
		) {
			return trimmed;
		}
		if (looksLikeInviteToken(trimmed)) {
			return `/invite/${encodeURIComponent(trimmed)}`;
		}
	}

	// Meeting invites, nudges, unknown types, and legacy redirects without type.
	return toAppPath(trimmed);
}

/** Resolves a tap target from native push payload fields. */
export function resolvePushNotificationPath(
	type: string | undefined,
	redirect: string | undefined,
): string {
	if (!redirect?.trim()) return "/summary";
	return normalizePushRedirect(type, redirect);
}
