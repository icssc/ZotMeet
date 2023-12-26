<script lang="ts">
  import "../app.pcss";
  import { AppShell, Drawer, initializeStores } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";

  import Header from "$lib/components/Header";
  import SideBar from "$lib/components/SideBar";

  $: activateHamburger = true;
  let appContainer: HTMLElement; // To listen to resize events

  onMount(() => {
    const reiszeObserver = new ResizeObserver((entries) => {
      // Only listen to the app container
      const entry = entries[0];
      activateHamburger = entry.contentRect.width < 768;
    });

    reiszeObserver.observe(appContainer);

    return () => {
      reiszeObserver.disconnect();
    };
  });

  initializeStores(); // Should be called only once
</script>

{#if activateHamburger}
  <Drawer position="right">
    <SideBar displayCloseButton={true} />
  </Drawer>
{/if}

<div id="app-container" bind:this={appContainer} class="h-screen w-screen">
  <AppShell slotSidebarLeft={activateHamburger ? "" : "w-64 h-full"} class="h-screen">
    <svelte:fragment slot="header">
      <Header hamburger={activateHamburger} />
    </svelte:fragment>

    <svelte:fragment slot="sidebarLeft">
      {#if !activateHamburger}
        <SideBar />
      {/if}
    </svelte:fragment>

    <slot />
  </AppShell>
</div>

<!-- Global styles -->
<style lang="postcss">
  :global(html) {
    font-family: sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #333;
  }
</style>
