/**
 * Post-auth redirect helpers, shared with the Expo app through
 * `@zotmeet/shared`; this module keeps the web app's import path stable.
 */
export {
	loginPathWithReturnTo,
	oauthLoginPath,
	safeReturnTo,
} from "@zotmeet/shared";
