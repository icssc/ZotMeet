/**
 * The OAuth providers ZotMeet signs in with, and the ICSSC OIDC settings for
 * each. Both apps go through the same identity broker (`auth.icssc.club`) and
 * the same web routes, so this is the one place the provider list lives.
 */

/** Provider id stored in `oauth_accounts.provider_id` (1:N user → accounts). */
export const OAUTH_ACCOUNT_PROVIDER = {
	google: "oidc",
	apple: "apple",
} as const;

export type OAuthLoginProvider = keyof typeof OAUTH_ACCOUNT_PROVIDER;

export const OAUTH_LOGIN_PROVIDERS = Object.keys(
	OAUTH_ACCOUNT_PROVIDER,
) as OAuthLoginProvider[];

/**
 * Whether an untrusted string — a route segment, a query parameter — names a
 * provider. `Object.hasOwn`, not `in`: `in` walks the prototype chain, so it
 * answers yes to the dozen names every object literal inherits from
 * `Object.prototype` ("constructor", "toString", "__proto__", …). That would
 * make this an unsound guard, and the narrowing is the whole point of it —
 * callers go straight from here to `OAUTH_LOGIN_CONFIG[provider]`, which for
 * an inherited name resolves to something truthy off the prototype rather
 * than `undefined`, so the mistake reads as a provider whose every setting is
 * missing instead of failing outright.
 */
export function isOAuthLoginProvider(
	value: string,
): value is OAuthLoginProvider {
	return Object.hasOwn(OAUTH_ACCOUNT_PROVIDER, value);
}

export type OAuthAccountProviderId =
	(typeof OAUTH_ACCOUNT_PROVIDER)[OAuthLoginProvider];

export const OAUTH_LOGIN_CONFIG = {
	google: {
		loginPath: "/auth/login/google",
		callbackPath: "/auth/login/google/callback",
		icsscProvider: "google",
		oauthAccountProviderId: OAUTH_ACCOUNT_PROVIDER.google,
		scopes: [
			"openid",
			"profile",
			"email",
			"https://www.googleapis.com/auth/calendar.readonly",
		],
	},
	apple: {
		loginPath: "/auth/login/apple",
		callbackPath: "/auth/login/apple/callback",
		icsscProvider: "apple",
		oauthAccountProviderId: OAUTH_ACCOUNT_PROVIDER.apple,
		scopes: ["openid", "profile", "email"],
	},
} as const;

export function getOAuthCallbackRedirectUri(
	baseUrl: string,
	provider: OAuthLoginProvider,
): string {
	return `${baseUrl}${OAUTH_LOGIN_CONFIG[provider].callbackPath}`;
}
