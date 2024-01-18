import { prisma } from "@lucia-auth/adapter-prisma";
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";

import { dev } from "$app/environment";
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
    };
  },
});

export type Auth = typeof auth;
