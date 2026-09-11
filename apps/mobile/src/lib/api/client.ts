import type { ApiErrorResponse } from "@zotmeet/shared";

/**
 * Thin `fetch` wrapper for the web app's `/api/*` routes. The mobile app has
 * no session cookie; it authenticates with a bearer token instead (see the
 * web app's `src/lib/auth/bearer.ts`). Both values are inlined at bundle time
 * from `EXPO_PUBLIC_*` env vars — see `.env.example`.
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;

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
