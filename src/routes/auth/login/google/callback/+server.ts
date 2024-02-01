import { OAuthRequestError } from "@lucia-auth/oauth";

// import { UserStatus, getDefaultPreferences } from "$lib/models/User";
// import { dbConnection, getNewUsernameIfInvalid } from "$lib/server/db";
import { auth, googleAuth } from "$lib/server/lucia";
// import { generateUserId } from "$lib/utils/id.js";

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

  console.log("no session");
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

  console.log("after state stuff");
  /**
   * Here we go...
   */
  try {
    const { googleUser } = await googleAuth.validateCallback(code);

    console.log("after googleUser");

    const getUser = async () => {
      //   if (existingUser) return existingUser;

      /// Probably will never happen but just to be sure.
      if (!googleUser.email) {
        return null;
      }

      // Query for the user with the same email.
      //   const executedQuery = await dbConnection.execute(
      //     // prettier-ignore
      //     'SELECT (id) FROM users WHERE email = (?)',
      //     [googleUser.email],
      //   );

      try {
        const dbUser = await auth.getUser(googleUser.email);

        if (dbUser) {
          return dbUser.userId;
        }
      } catch (error) {
        console.log(error);
      }

      //   // User with the same email found.
      //   if (dbUser) {
      //     return dbUser.userId;
      //   }

      console.log("after dbUser stuff");

      const token = crypto.randomUUID();
      const user = await auth.createUser({
        userId: googleUser.email,
        key: {
          providerId: "email",
          providerUserId: googleUser.email.toLowerCase(),
          password: null,
        },
        attributes: {
          email: googleUser.email.toLowerCase(),
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          //   role: "USER",
          verified: false,
          receiveEmail: true,
          token: token,
        },
      });

      return user;
    };

    const user = await getUser();

    console.log("try get user");
    console.log(user);

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
      userId: user,
      attributes: {},
    });

    locals.auth.setSession(session);

    /**
     * Home run!
     */
    // Redirect the page of choice.
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/auth",
      },
    });
  } catch (e) {
    // TODO: Log error into system.
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
