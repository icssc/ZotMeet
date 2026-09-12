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

/** `POST /api/auth/logout`. Idempotent; never fails on an already-dead token. */
export async function logout(): Promise<void> {
	await apiFetch<undefined>("/api/auth/logout", { method: "POST" });
}
