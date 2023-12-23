<script lang="ts">
  export let icon: string;
  export let label: string;
  export let href: string;
</script>

<a id="sidebar-link-{label}" {href}>
  <div class="flex flex-row whitespace-nowrap hover:bg-surface-300 w-full gap-2 pl-5 p-3">
    <img src={icon} alt="Icon" class="w-8 h-8" />
    <span class="text-lg">{label}</span>
  </div>
</a>
