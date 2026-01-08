import { OAuth2Client } from "arctic";

if (!process.env.OIDC_CLIENT_ID) {
	throw new Error("Missing OIDC_CLIENT_ID env var.");
}
if (!process.env.GOOGLE_OAUTH_REDIRECT_URI) {
	throw new Error("Missing GOOGLE_OAUTH_REDIRECT_URI env var.");
}

export const oauth = new OAuth2Client(
	process.env.OIDC_CLIENT_ID,
	null,
	process.env.GOOGLE_OAUTH_REDIRECT_URI,
);
