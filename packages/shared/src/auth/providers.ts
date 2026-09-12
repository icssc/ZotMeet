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

export function isOAuthLoginProvider(
	value: string,
): value is OAuthLoginProvider {
	return value in OAUTH_ACCOUNT_PROVIDER;
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
