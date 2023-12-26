<script lang="ts">
  /**
   * Should be an SVG icon from Iconify `~icons/material-symbols`
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let Icon: any;
  export let label: string;
  export let href: string;
</script>

<a id="sidebar-link-{label}" {href}>
  <div
    class="flex flex-row whitespace-nowrap hover:bg-secondary-500 w-full gap-4 pl-5 p-3 rounded-lg"
  >
    <Icon class="w-8 h-8" />
    <span class="text-lg">{label}</span>
  </div>
</a>
