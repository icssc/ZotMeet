// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import "unplugin-icons/types/svelte";

declare global {
  namespace App {
    interface Locals {
      auth: import("lucia").AuthRequest;
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
}

/// <reference types="lucia-auth" />
declare global {
  namespace Lucia {
    type Auth = import("$lib/server/lucia").Auth;
    type UserAttributes = {
      email: string;
      firstName: string;
      lastName: string;
      // role: string;
      verified: boolean;
      receiveEmail: boolean;
      token: string;
    };
  }
}

export {};
