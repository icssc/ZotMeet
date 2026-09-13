import type {
	NativeOAuthTokenRequest,
	NativeOAuthTokenResponse,
	OAuthLoginProvider,
	SessionResponse,
} from "@zotmeet/shared";
import { apiFetch } from "@/lib/api/client";

/**
 * The mobile counterpart to the web app's session plumbing — its OAuth
 * callback, `getCurrentSession`, and `logoutAction` — over HTTP. Each
 * function maps to one route handler under the web app's `src/app/api/auth/`.
 */

/**
 * `POST /api/auth/login/:provider`. Redeems the authorization code the web
 * callback bounced to the app; a rejected code surfaces as `ApiError` 400.
 */
export function exchangeOAuthCode(
	provider: OAuthLoginProvider,
	request: NativeOAuthTokenRequest,
): Promise<NativeOAuthTokenResponse> {
	return apiFetch<NativeOAuthTokenResponse>(`/api/auth/login/${provider}`, {
		method: "POST",
		body: JSON.stringify(request),
	});
}

/** `GET /api/auth/session`. A dead token surfaces as `ApiError` 401. */
export function getSession(): Promise<SessionResponse> {
	return apiFetch<SessionResponse>("/api/auth/session");
}

/**
 * How long the detached logout request is given before it is abandoned. It
 * blocks nothing, so it can be patient; it is bounded only so a hung socket
 * is eventually released rather than held for the life of the process.
 */
const LOGOUT_TIMEOUT_MS = 10_000;

/**
 * `POST /api/auth/logout`. Idempotent; never fails on an already-dead token.
 *
 * The token is passed in rather than read from storage, because `signOut`
 * deletes it from the device first and does not wait for this to finish —
 * by the time the request is built there is nothing left to look up.
 */
export async function logout(token: string): Promise<void> {
	await apiFetch<undefined>("/api/auth/logout", {
		method: "POST",
		authToken: token,
		timeoutMs: LOGOUT_TIMEOUT_MS,
	});
}
