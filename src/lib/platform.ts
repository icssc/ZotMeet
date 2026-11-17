import type { OAuthLoginProvider } from "@/lib/auth/providers";

const NATIVE_IOS_COOKIE = "app-platform=iOS App Store";

export function isNativeIosApp(): boolean {
	if (typeof document === "undefined") {
		return false;
	}

	return document.cookie.includes(NATIVE_IOS_COOKIE);
}

type CookieReader = {
	get: (name: string) => { value: string } | undefined;
};

export function isNativeIosAppFromCookies(cookieStore: CookieReader): boolean {
	return cookieStore.get("app-platform")?.value === "iOS App Store";
}

/**
 * OAuth redirect URI for sign-in inside the native iOS wrapper.
 *
 * Universal Link backed by the AASA file at
 * https://zotmeet.com/.well-known/apple-app-site-association.
 */
export function getNativeIosCallbackRedirectUri(
	baseUrl: string,
	provider: OAuthLoginProvider,
): string {
	return `${baseUrl}/auth/login/${provider}/callback/native`;
}

/** @deprecated Use getNativeIosCallbackRedirectUri("google") */
export function getNativeIosRedirectUri(baseUrl: string) {
	return getNativeIosCallbackRedirectUri(baseUrl, "google");
}
