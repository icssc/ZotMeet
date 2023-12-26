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
  <div class="flex flex-row justify-between h-full">
    <div class="flex flex-row">
      <img src="/icon.png" class="h-10 w-10 rounded-full" alt="ZotMeet icon" />
      <div class="text-4xl font-bold ml-10 mt-auto mb-auto">ZotMeet</div>
      <!-- Hamburger -->
      {#if hamburger}
        <button on:click={openDrawer}>
          <HamburgerMenu class="h-12 w-12" />
        </button>
      {/if}
    </div>
  </div>
</header>
