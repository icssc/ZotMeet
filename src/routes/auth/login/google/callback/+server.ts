import { OAuthRequestError } from "@lucia-auth/oauth";
import type { GoogleUser } from "@lucia-auth/oauth/providers";

import { auth, googleAuth } from "$lib/server/lucia";

const getUser = async (googleUser: GoogleUser) => {
  if (!googleUser.email) {
    return null;
  }

  try {
    const dbUser = await auth.getUser(googleUser.sub);
    if (dbUser) {
      return dbUser;
    }
  } catch (error) {
    /* If a user cannot be found, an error is raised and caught here. */
  }

  const token = crypto.randomUUID();
  const user = await auth.createUser({
    userId: googleUser.sub,
    key: {
      providerId: "google",
      providerUserId: googleUser.email.toLowerCase(),
      password: null,
    },
    attributes: {
      email: googleUser.email.toLowerCase(),
      firstName: googleUser.given_name ?? "",
      lastName: googleUser.family_name ?? "",
      //   role: "USER",
      verified: false,
      receiveEmail: true,
      token: token,
    },
  });

  return user;
};

export const GET = async ({ url, cookies, locals }) => {
  /**
   * Check for a session. if it exists,
   * redirect to a page of your liking.
   */
  const session = await locals.auth.validate();
  if (session) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/auth",
      },
    });
  }

  /**
   * Validate state of the request.
   */
  const storedState = cookies.get("google_oauth_state") ?? null;
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const { googleUser } = await googleAuth.validateCallback(code);
    const user = await getUser(googleUser);

    if (!user) {
      /**
       * You should probably redirect the user to a page and show a
       * message that the account could not be created.
       *
       * This is a very rare case, but it can happen.
       */
      return new Response(null, {
        status: 500,
      });
    }

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    locals.auth.setSession(session);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/auth",
      },
    });
  } catch (e) {
    console.log(e);

    // Invalid code.
    if (e instanceof OAuthRequestError) {
      return new Response(null, {
        status: 400,
      });
    }

    // All other errors.
    return new Response(null, {
      status: 500,
    });
  }
};
