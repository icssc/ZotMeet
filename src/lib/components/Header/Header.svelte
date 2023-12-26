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
  <div class="flex flex-row justify-between h-full">
    <img src="/icon.png" class="h-10 w-10 rounded-full" alt="ZotMeet icon" />
    <div class="text-4xl font-bold ml-10 mt-auto mb-auto">ZotMeet</div>
    <!-- Hamburger -->
    {#if hamburger}
      <button on:click={openDrawer}>
        <HamburgerMenu class="h-12 w-12" />
      </button>
    {:else}
      <div
        id="user-info-container"
        class="flex flex-row justify-end gap-2 mr-4 mt-auto mb-auto ml-auto w-64"
      >
        <div
          id="user-name-container"
          class="align-text-bottom flex-col content-center justify-center inline-grid"
        >
          <span class="text-lg align-text-bottom h-full">Peter Anteater</span>
        </div>
        <img src="user-icon.png" alt="User Icon" class="user-icon rounded-full w-12 h-12" />
      </div>
    {/if}
  </div>
</header>
