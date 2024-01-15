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

<header class="h-16 bg-primary-600">
  <div class="h-full flex-between md:mx-4">
    <img src="/icon.png" class="w-10 h-10 rounded-full" alt="ZotMeet icon" />
    <div class="text-4xl font-bold md:ml-10">
      <a href="/">ZotMeet</a>
    </div>

    <!-- Hamburger -->
    {#if hamburger}
      <button on:click={openDrawer}>
        <HamburgerMenu class="w-12 h-12" />
      </button>
    {:else}
      <div id="user-info-container" class="flex items-center justify-end flex-1 gap-2">
        <div id="user-name-container">
          <span class="text-lg">Peter Anteater</span>
        </div>
        <img src="user-icon.png" alt="User Icon" class="w-12 h-12 rounded-full user-icon" />
      </div>
    {/if}
  </div>
</header>
