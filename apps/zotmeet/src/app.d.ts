declare global {
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

export {}
