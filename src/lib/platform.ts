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
 * https://zotmeet.com/.well-known/apple-app-site-association. ASWebAuthenticationSession
 * (iOS 17.4+) matches this callback via AASA, so only the ZotMeet iOS binary can
 * receive it.
 */
export function getNativeIosRedirectUri(baseUrl: string) {
	return `${baseUrl}/auth/login/google/callback/native`;
}
