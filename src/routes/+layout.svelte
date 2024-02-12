<script lang="ts">
  import SideBar from "$lib/components/SidebarV2/SideBar.svelte";
  import "../app.pcss";
</script>

<div
  class="flex h-full min-h-screen w-full flex-row bg-gradient-to-l from-[#EEEEEE] to-[#EAEFF2] pl-6 pt-6"
>
  <SideBar />
  <slot />
</div>

<!-- Global styles -->
<style lang="postcss">
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap");

  :global(html) {
    font-family:
      DM Sans,
      Montserrat,
      sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #333;
  }
</style>
