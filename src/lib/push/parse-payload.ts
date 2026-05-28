const PUSH_DATA_KEYS = [
	"type",
	"redirect",
	"title",
	"message",
	"groupId",
	"createdBy",
] as const;

export type NativePushPayload = {
	type?: string;
	redirect?: string;
	title?: string;
	message?: string;
	groupId?: string;
	createdBy?: string;
};

function stringField(value: unknown): string | undefined {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : undefined;
	}
	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}
	return undefined;
}

function pickPushFields(record: Record<string, unknown>): NativePushPayload {
	const payload: NativePushPayload = {};

	for (const key of PUSH_DATA_KEYS) {
		const value = stringField(record[key]);
		if (value !== undefined) {
			payload[key] = value;
		}
	}

	return payload;
}

/**
 * Extracts FCM custom data from the JSON blob iOS forwards from `userInfo`.
 */
export function parseNativePushPayload(detail: unknown): NativePushPayload {
	if (typeof detail === "string") {
		try {
			return parseNativePushPayload(JSON.parse(detail) as unknown);
		} catch {
			return {};
		}
	}

	if (!detail || typeof detail !== "object") {
		return {};
	}

	const record = detail as Record<string, unknown>;
	const direct = pickPushFields(record);
	if (direct.type || direct.redirect) {
		return direct;
	}

	if (record.data && typeof record.data === "object") {
		const nested = pickPushFields(record.data as Record<string, unknown>);
		if (nested.type || nested.redirect) {
			return nested;
		}
	}

	return direct;
}
