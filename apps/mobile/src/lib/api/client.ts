import type { ApiErrorResponse } from "@zotmeet/shared";

/**
 * Thin `fetch` wrapper for the web app's `/api/*` routes. The mobile app has
 * no session cookie; it authenticates with a bearer token instead (see the
 * web app's `src/lib/auth/bearer.ts`). Both values are inlined at bundle time
 * from `EXPO_PUBLIC_*` env vars — see `.env.example`.
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * `MOBILE_DEV_API_TOKEN` is a *shared* credential standing in for one member,
 * not a per-user session, so it must never leave a developer's machine: an
 * `EXPO_PUBLIC_*` value is inlined verbatim into the JS bundle, and anything
 * distributed — an `eas build`, or an `eas update` published to a channel that
 * Expo Go can open — hands that token to whoever unpacks the bundle, letting
 * them call `/api/*` as the configured host.
 *
 * Reading it behind `__DEV__` keeps it out of those bundles rather than
 * trusting the process not to build one: `__DEV__` is a literal `false` in a
 * release bundle, so Metro drops this branch and the token string with it.
 * Until a real native login issues per-user session tokens (which
 * `getMemberIdFromBearer` already accepts), a distributed build is
 * unauthenticated by design.
 */
const API_TOKEN = __DEV__ ? process.env.EXPO_PUBLIC_API_TOKEN : undefined;

/** A non-2xx response, carrying the status and the server's `{ error }` body. */
export class ApiError extends Error {
	readonly status: number;
	readonly issues?: unknown;

	constructor(status: number, body: ApiErrorResponse) {
		super(body.error);
		this.name = "ApiError";
		this.status = status;
		this.issues = body.issues;
	}
}

export async function apiFetch<T>(
	path: string,
	init: RequestInit = {},
): Promise<T> {
	if (!API_URL) {
		throw new Error(
			"EXPO_PUBLIC_API_URL is not set — copy apps/mobile/.env.example to .env.local.",
		);
	}

	const headers = new Headers(init.headers);
	headers.set("Accept", "application/json");
	if (init.body !== undefined) headers.set("Content-Type", "application/json");
	if (API_TOKEN) headers.set("Authorization", `Bearer ${API_TOKEN}`);

	const response = await fetch(`${API_URL}${path}`, { ...init, headers });

	if (!response.ok) {
		let body: ApiErrorResponse = {
			error: response.statusText || "Request failed",
		};
		try {
			body = (await response.json()) as ApiErrorResponse;
		} catch {
			// Not JSON — keep the status text.
		}
		throw new ApiError(response.status, body);
	}

	return (await response.json()) as T;
}
