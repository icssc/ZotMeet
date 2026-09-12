import type { ApiErrorResponse } from "@zotmeet/shared";
import { getSessionToken } from "@/lib/auth/session";

/**
 * Thin `fetch` wrapper for the web app's `/api/*` routes. The mobile app has
 * no session cookie; it authenticates with a bearer token instead (see the
 * web app's `src/lib/auth/bearer.ts`): the session token from a native
 * sign-in when there is one (`lib/auth/session.ts`), else the dev token
 * below. Both env values are inlined at bundle time from `EXPO_PUBLIC_*` env
 * vars — see `.env.example`.
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL;

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
 * A distributed build therefore has no credential until the user signs in,
 * by design.
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
	const token = (await getSessionToken()) ?? API_TOKEN;
	if (token) headers.set("Authorization", `Bearer ${token}`);

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

	// `204 No Content` (logout) has nothing to parse.
	if (response.status === 204) return undefined as T;
	return (await response.json()) as T;
}
