import { OAuth2RequestError } from "arctic";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";

import type { RequestHandler } from "./$types";

import {
  GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME,
  GOOGLE_OAUTH_STATE_COOKIE_NAME,
  createAndSetSession,
} from "$lib/db/authUtils.server";
import { db } from "$lib/db/drizzle";
import { oauthAccountsTable, users } from "$lib/db/schema";
import { googleOauth, lucia } from "$lib/server/lucia";

type GoogleUser = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
};

export const GET: RequestHandler = async (event) => {
  const code = event.url.searchParams.get("code");
  const state = event.url.searchParams.get("state");

  const storedState = event.cookies.get(GOOGLE_OAUTH_STATE_COOKIE_NAME);
  const storedCodeVerifier = event.cookies.get(GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME);

  // Validate OAuth state and code verifier
  if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
    return new Response("Invalid OAuth state or code verifier", {
      status: 400,
    });
  }

  try {
    const tokens = await googleOauth.validateAuthorizationCode(code, storedCodeVerifier);

    const googleUserResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const googleUser = (await googleUserResponse.json()) as GoogleUser;

    if (!googleUser.email) {
      return new Response("No primary email address", {
        status: 400,
      });
    }

    if (!googleUser.email_verified) {
      return new Response("Unverified email", {
        status: 400,
      });
    }

    // Check if the user already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, googleUser.email));

    if (existingUser) {
      // Check if the user already has a Google OAuth account linked
      const [existingOauthAccount] = await db
        .select()
        .from(oauthAccountsTable)
        .where(
          and(
            eq(oauthAccountsTable.providerId, "google"),
            eq(oauthAccountsTable.providerUserId, googleUser.sub),
          ),
        );

      if (!existingOauthAccount) {
        // Add the 'google' auth provider to the user's authMethods list
        const authMethods = existingUser.authMethods || [];
        authMethods.push("google");

        await db.transaction(async (trx) => {
          // Link the Google OAuth account to the existing user
          await trx.insert(oauthAccountsTable).values({
            userId: existingUser.id,
            providerId: "google",
            providerUserId: googleUser.sub,
          });

          // Update the user's authMethods list
          await trx
            .update(users)
            .set({
              authMethods,
            })
            .where(eq(users.id, existingUser.id));
        });
      }

      await createAndSetSession(lucia, existingUser.id, event.cookies);
    } else {
      // Create a new user and their OAuth account
      const userId = generateId(15);

      await db.transaction(async (trx) => {
        await trx.insert(users).values({
          id: userId,
          displayName: googleUser.name,
          email: googleUser.email,
          authMethods: ["google"],
        });

        await trx.insert(oauthAccountsTable).values({
          userId,
          providerId: "google",
          providerUserId: googleUser.sub,
        });
      });

      await createAndSetSession(lucia, userId, event.cookies);
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    console.error(error);

    // the specific error message depends on the provider
    if (error instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }

    return new Response(null, {
      status: 500,
    });
  }
};
