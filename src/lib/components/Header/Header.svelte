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
  <div class="flex-between h-full md:mx-4">
    <img src="/icon.png" class="h-10 w-10 rounded-full" alt="ZotMeet icon" />
    <div class="text-4xl font-bold md:ml-10">
      <a href="/">ZotMeet</a>
    </div>

    <!-- Hamburger -->
    {#if hamburger}
      <button on:click={openDrawer}>
        <HamburgerMenu class="h-12 w-12" />
      </button>
    {:else}
      <div id="user-info-container" class="flex flex-1 items-center justify-end gap-2">
        <div id="user-name-container">
          <span class="text-lg">Peter Anteater</span>
        </div>
        <img src="user-icon.png" alt="User Icon" class="user-icon h-12 w-12 rounded-full" />
      </div>
    {/if}
  </div>
</header>
