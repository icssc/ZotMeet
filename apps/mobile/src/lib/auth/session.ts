import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Where the session lives on the device. The web app keeps the session token
 * in an `httpOnly` cookie (`src/lib/auth/cookies.ts`) and the browser sends
 * it back by itself; here it sits in the keychain / keystore via
 * `expo-secure-store` and `apiFetch` attaches it as `Authorization: Bearer`.
 * The token itself is the same value — what `POST /api/auth/login/<provider>`
 * returned — and the server validates it exactly as it does the cookie.
 *
 * The web app's `session.ts` is the server side of the same concept (the
 * `sessions` table); there is no database here, so this module is only the
 * storage half.
 */

const SESSION_TOKEN_KEY = "zotmeet.session_token";
const PENDING_LOGIN_KEY = "zotmeet.oauth_pending";

/**
 * A login that has left for the browser and not yet come back. Persisted, not
 * held in memory, because on Android the callback link can arrive in a fresh
 * process if the app was evicted while the browser was in front.
 */
export type PendingLogin = {
	provider: "google" | "apple";
	state: string;
	codeVerifier: string;
	/** Epoch ms. Older than `PENDING_LOGIN_TTL_MS` is treated as abandoned. */
	startedAt: number;
};

export const PENDING_LOGIN_TTL_MS = 10 * 60 * 1000;

// SecureStore has no web implementation; the Expo web preview falls back to
// localStorage so the flow can be exercised there too (never a production
// surface — the web app proper uses its cookie).
const storage = {
	async get(key: string): Promise<string | null> {
		if (Platform.OS === "web") {
			try {
				return globalThis.localStorage?.getItem(key) ?? null;
			} catch {
				return null;
			}
		}
		return SecureStore.getItemAsync(key);
	},
	async set(key: string, value: string): Promise<void> {
		if (Platform.OS === "web") {
			globalThis.localStorage?.setItem(key, value);
			return;
		}
		await SecureStore.setItemAsync(key, value);
	},
	async remove(key: string): Promise<void> {
		if (Platform.OS === "web") {
			globalThis.localStorage?.removeItem(key);
			return;
		}
		await SecureStore.deleteItemAsync(key);
	},
};

// Read once per launch; every `apiFetch` asks, and the keychain is slow.
let cachedToken: string | null | undefined;

export async function getSessionToken(): Promise<string | null> {
	if (cachedToken === undefined) {
		cachedToken = await storage.get(SESSION_TOKEN_KEY);
	}
	return cachedToken;
}

export async function setSessionToken(token: string): Promise<void> {
	cachedToken = token;
	await storage.set(SESSION_TOKEN_KEY, token);
}

export async function deleteSessionToken(): Promise<void> {
	cachedToken = null;
	await storage.remove(SESSION_TOKEN_KEY);
}

export async function setPendingLogin(pending: PendingLogin): Promise<void> {
	await storage.set(PENDING_LOGIN_KEY, JSON.stringify(pending));
}

/** Reads and clears the pending login in one step — a login completes once. */
export async function takePendingLogin(): Promise<PendingLogin | null> {
	const raw = await storage.get(PENDING_LOGIN_KEY);
	if (raw === null) return null;
	await storage.remove(PENDING_LOGIN_KEY);

	try {
		const pending = JSON.parse(raw) as PendingLogin;
		if (Date.now() - pending.startedAt > PENDING_LOGIN_TTL_MS) return null;
		return pending;
	} catch {
		return null;
	}
}
