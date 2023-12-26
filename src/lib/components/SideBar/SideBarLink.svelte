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
    class="flex flex-row whitespace-nowrap hover:bg-secondary-500 w-full gap-4 p-5 lg:p-3 rounded-lg"
  >
    <Icon class="w-14 h-14 lg:w-10 lg:h-10 ml-3" />
    <span class="text-2xl lg:text-xl mt-auto mb-auto">{label}</span>
  </div>
</a>
