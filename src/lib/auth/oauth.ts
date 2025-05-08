import { Google } from "arctic";

export const google = new Google(
    process.env.GOOGLE_OAUTH_CLIENT_ID || "default-client-id",
    process.env.GOOGLE_OAUTH_CLIENT_SECRET || "default-client-secret",
    process.env.GOOGLE_OAUTH_REDIRECT_URI || "default-redirect-uri"
);
