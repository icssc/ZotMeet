<script lang="ts">
  export let text: string;
  export let href: string;
  export let handleClick: (() => void) | undefined;
</script>

<a {href}>
  <button
    class="btn h-12 w-full justify-start space-x-3 border-none bg-transparent text-xl font-normal shadow-none md:text-lg"
    on:click={handleClick}
  >
    <slot />
    <!-- Icon -->
    <p>{text}</p>
  </button>
</a>
