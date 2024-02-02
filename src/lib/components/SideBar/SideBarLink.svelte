<script lang="ts">
  import { getDrawerStore } from "@skeletonlabs/skeleton";

  /**
   * Should be an SVG icon from Iconify `~icons/material-symbols`
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let Icon: any;
  export let label: string;
  export let href: string;

  const closeDrawer = getDrawerStore().close;
</script>

<a id="sidebar-link-{label}" {href} on:click={closeDrawer}>
  <div
    class="flex w-full flex-row items-center gap-4 whitespace-nowrap rounded-lg p-5 hover:bg-secondary-500 md:p-3"
  >
    <Icon class="ml-3 h-14 w-14 md:h-10 md:w-10" />
    <span class="text-2xl md:text-xl">{label}</span>
  </div>
</a>
