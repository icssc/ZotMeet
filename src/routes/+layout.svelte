<script lang="ts">
  import Navbar from "$lib/components/navigation/Navbar.svelte";
  import SideBar from "$lib/components/navigation/Sidebar.svelte";
  import "../app.pcss";
</script>

<div
  class="relative flex h-full min-h-screen w-full flex-col bg-gradient-to-l from-[#EEEEEE] to-[#EAEFF2] md:flex-row md:pl-6 md:pt-6"
>
  <SideBar />
  <Navbar />

  <main
    class="flex max-h-[calc(100vh-1.5rem)] w-full flex-col gap-y-5 overflow-x-clip border-t-2 bg-white px-2 pb-6 md:gap-y-6 md:overflow-y-auto md:rounded-tl-xl md:px-4"
  >
    <slot />
  </main>
</div>

<!-- Global styles -->
<style lang="postcss">
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap");
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
