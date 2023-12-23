<script lang="ts">
  import { getDrawerStore } from "@skeletonlabs/skeleton";

  let hamburger: boolean = true;

  const drawerStore = getDrawerStore();

  const openDrawer = () => {
    drawerStore.open();
    console.log("open");
  };
</script>

<!-- Header for the app -->

<header>
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
        <img
          src="https://via.placeholder.com/50"
          alt="Hamburger icon"
          class="h-10 w-10 mr-1 mt-auto mb-auto"
        />
      </button>
    {/if}
  </div>
</header>
