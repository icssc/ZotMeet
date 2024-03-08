// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import "unplugin-icons/types/svelte";
import "lucia-auth";

import type { AuthRequest } from "lucia";

import type { Auth as CustomAuth } from "$lib/server/lucia";

declare global {
  namespace App {
    interface Locals {
      auth: AuthRequest;
      user: Lucia.UserAttributes;
      startTimer: number;
      error: string;
      errorId: string;
      errorStackTrace: string;
      message: unknown;
      track: unknown;
    }
    interface Error {
      code?: string;
      errorId?: string;
    }
  }
  namespace Lucia {
    type Auth = CustomAuth;

    type UserAttributes = {
      userId: string;
      email: string;
      username: string;
    };
  }
}

export {};
