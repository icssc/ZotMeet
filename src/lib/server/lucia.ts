import { prisma } from "@lucia-auth/adapter-prisma";
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";

import { dev } from "$app/environment";
import { prisma as client } from "$lib/server/prisma";

export const auth = lucia({
  adapter: prisma(client),
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),
  getUserAttributes: (_) => ({}),
});

export type Auth = typeof auth;
