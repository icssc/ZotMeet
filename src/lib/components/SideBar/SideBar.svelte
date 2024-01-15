<script lang="ts">
  import { getDrawerStore } from "@skeletonlabs/skeleton";

  import SideBarFooter from "./SideBarFooter.svelte";
  import SideBarLink from "./SideBarLink.svelte";

  import CalendarIcon from "~icons/material-symbols/calendar-clock";
  import CloseIcon from "~icons/material-symbols/close-rounded";
  import SettingsIcon from "~icons/material-symbols/settings-rounded";

  export let displayCloseButton = false;

  const drawerStore = getDrawerStore();

  const closeDrawer = drawerStore.close;
</script>

<div
  id="sidebar"
  class="flex flex-col w-full h-full rounded-r-none rounded-left-lg md:rounded-r-lg md:rounded-l-none bg-secondary-400 outline-secondary-800 card outline-5"
>
  <div id="sidebar-links" class="flex flex-col">
    {#if displayCloseButton}
      <div class="w-full flex flex-row justify-end">
        <button class="p-2 ml-auto" on:click={closeDrawer}>
          <CloseIcon class="h-12 w-12" />
        </button>
      </div>
    {/if}
    <SideBarLink Icon={CalendarIcon} label="Summary" href="/summary" />
    <SideBarLink Icon={SettingsIcon} label="Settings" href="/settings" />
  </div>

  <div id="sidebar-footer-container" class="mt-auto m-2">
    <SideBarFooter />
  </div>
</div>
