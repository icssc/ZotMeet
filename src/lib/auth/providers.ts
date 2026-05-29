/** Provider id stored in `oauth_accounts.provider_id` (1:N user → accounts). */
export const OAUTH_ACCOUNT_PROVIDER = {
	google: "oidc",
	apple: "apple",
} as const;

export type OAuthLoginProvider = keyof typeof OAUTH_ACCOUNT_PROVIDER;

export type OAuthAccountProviderId =
	(typeof OAUTH_ACCOUNT_PROVIDER)[OAuthLoginProvider];

export const OAUTH_LOGIN_CONFIG = {
	google: {
		callbackPath: "/auth/login/google/callback",
		icsscProvider: "google",
		oauthAccountProviderId: OAUTH_ACCOUNT_PROVIDER.google,
		scopes: [
			"openid",
			"profile",
			"email",
			"https://www.googleapis.com/auth/calendar.readonly",
			"https://www.googleapis.com/auth/calendar.events.owned",
		],
	},
	apple: {
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
