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
    class="flex flex-row items-center whitespace-nowrap hover:bg-secondary-500 w-full gap-4 p-5 md:p-3 rounded-lg"
  >
    <Icon class="w-14 h-14 md:w-10 md:h-10 ml-3" />
    <span class="text-2xl md:text-xl">{label}</span>
  </div>
</a>
