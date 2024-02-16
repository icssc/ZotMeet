import { prisma } from "@lucia-auth/adapter-prisma";
import { google } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";

import { dev } from "$app/environment";
import {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URI,
} from "$env/static/private";
import { prisma as client } from "$lib/server/prisma";

export const auth = lucia({
  adapter: prisma(client, {
    user: "user",
    key: "key",
    session: "session",
  }),
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),
  getUserAttributes: (data) => {
    return {
      userId: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      // role: data.role,
      verified: data.verified,
      receiveEmail: data.receiveEmail,
      token: data.token,

      googleId: data.google_id,
      username: data.username,
    };
  },
});

export const googleAuth = google(auth, {
  clientId: GOOGLE_OAUTH_CLIENT_ID!,
  clientSecret: GOOGLE_OAUTH_CLIENT_SECRET!,
  redirectUri: GOOGLE_OAUTH_REDIRECT_URI!,
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ],
});

export type Auth = typeof auth;
