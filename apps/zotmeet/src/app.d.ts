import 'unplugin-icons/types/svelte'

import type { User } from '@auth/core/types'

declare global {
  namespace App {
    interface Locals {
      /**
       * Helper function to get the user for the current request.
       */
      getUser: () => Promise<User | null>
    }

    interface PageData {
      /**
       * User parsed from session / cookies.
       */
      user?: User
    }
  }

  /**
   * Utility type for Svelte event handlers.
   *
   * @example
   *
   * ```svelte
   *
   * <script lang="ts">
   *  const handleInput = (e: SvelteInputEvent) => console.log(e)
   *  const handleMouseClick = (e: SvelteInputEvent<MouseEvent>) => console.log(e)
   *  const handleKeydown = (e: SvelteInputEvent<KeyboardEvent>) => console.log(e)
   * </script>
   *
   * <button on:click={handleClick}>Click me</button>
   *
   * ```
   */
  type SvelteInputEvent<E extends Event = Event, Element = HTMLInputElement> = E & {
    currentTarget: EventTarget & Element
  }
}
