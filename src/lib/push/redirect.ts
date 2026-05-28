import { NOTIFICATION_TYPES } from "@/lib/notification/types";

/**
 * App-relative path used in FCM data payloads and native tap handling.
 * In-app notification rows may still store full URLs or invite tokens.
 */
export function normalizePushRedirect(type: string, redirect: string): string {
	const trimmed = redirect.trim();
	if (!trimmed) return "/summary";

	if (type === NOTIFICATION_TYPES.GROUP_INVITE) {
		if (trimmed.startsWith("/invite/")) return trimmed;
		if (trimmed.startsWith("/")) return trimmed;
		return `/invite/${encodeURIComponent(trimmed)}`;
	}

	if (
		type === NOTIFICATION_TYPES.MEETING_INVITE ||
		type === NOTIFICATION_TYPES.NUDGE
	) {
		if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
			try {
				const url = new URL(trimmed);
				return `${url.pathname}${url.search}${url.hash}` || "/summary";
			} catch {
				return "/summary";
			}
		}
		return trimmed.startsWith("/") ? trimmed : "/summary";
	}

	if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
		try {
			const url = new URL(trimmed);
			return `${url.pathname}${url.search}${url.hash}` || "/summary";
		} catch {
			return "/summary";
		}
	}

	return trimmed.startsWith("/") ? trimmed : "/summary";
}
