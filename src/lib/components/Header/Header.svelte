<script lang="ts">
  import { getDrawerStore } from "@skeletonlabs/skeleton";

  import HamburgerMenu from "~icons/material-symbols/menu-rounded";

  export let hamburger: boolean;

  const drawerStore = getDrawerStore();

  const openDrawer = () => {
    drawerStore.open();
  };
</script>

<!-- Header for the app -->

<header class="h-16 bg-white">
  <div class="flex flex-row justify-between">
    <div class="flex flex-row">
      <div class="flex flex-col justify-center">
        <img src="/icon.png" class="h-10 w-10 rounded-full" alt="" />
      </div>
      <div class="flex flex-col justify-center">
        <div class="text-2xl font-bold">ZotMeet</div>
      </div>
    </div>
    <!-- Hamburger -->
    {#if hamburger}
      <button on:click={openDrawer}>
        <HamburgerMenu class="h-12 w-12" />
      </button>
    {/if}
  </div>
</header>
