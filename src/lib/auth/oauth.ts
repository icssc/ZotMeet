import { OAuth2Client } from "arctic";

export const oauth = new OAuth2Client(
    process.env.OIDC_CLIENT_ID!,
    null,
    process.env.GOOGLE_OAUTH_REDIRECT_URI!
);
