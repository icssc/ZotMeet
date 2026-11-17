/**
 * The provider list lives in `@zotmeet/shared` so the Expo app reads the same
 * callback paths and scopes; this module keeps the web app's import path
 * stable.
 */
export {
	getOAuthCallbackRedirectUri,
	OAUTH_ACCOUNT_PROVIDER,
	OAUTH_LOGIN_CONFIG,
	type OAuthAccountProviderId,
	type OAuthLoginProvider,
} from "@zotmeet/shared";
