// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import "unplugin-icons/types/svelte";
import "lucia-auth";

import type { AuthRequest } from "lucia";

declare global {
  namespace App {
    interface Locals {
      auth: AuthRequest;
      user: import("lucia").User | null;
      session: import("lucia").Session | null;
    }
    interface Error {
      code?: string;
      errorId?: string;
    }
  }
}

export {};
