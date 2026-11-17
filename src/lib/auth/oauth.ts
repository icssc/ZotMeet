import { OAuth2Client } from "arctic";

if (!process.env.OIDC_CLIENT_ID) {
	throw new Error("Missing OIDC_CLIENT_ID env var.");
}
if (!process.env.GOOGLE_OAUTH_REDIRECT_URI) {
	throw new Error("Missing GOOGLE_OAUTH_REDIRECT_URI env var.");
}

const defaultRedirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
const oidcClientId = process.env.OIDC_CLIENT_ID;

export function getOAuthClient(redirectUri?: string) {
	return new OAuth2Client(
		oidcClientId,
		null,
		redirectUri ?? defaultRedirectUri,
	);
}

export const oauth = getOAuthClient();
