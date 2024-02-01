<script lang="ts">
  import { getDrawerStore } from "@skeletonlabs/skeleton";

  import SideBarFooter from "./SideBarFooter.svelte";
  import SideBarLink from "./SideBarLink.svelte";

  import CalendarIcon from "~icons/material-symbols/calendar-clock";
  import CloseIcon from "~icons/material-symbols/close-rounded";
  import GroupsIcon from "~icons/material-symbols/groups";
  import SettingsIcon from "~icons/material-symbols/settings-rounded";

  export let displayCloseButton = false;

  const drawerStore = getDrawerStore();

  const closeDrawer = drawerStore.close;
</script>

<div
  id="sidebar"
  class="rounded-left-lg outline-5 card flex h-full w-full flex-col rounded-r-none bg-secondary-400 outline-secondary-800 md:rounded-l-none md:rounded-r-lg"
>
  <div id="sidebar-links" class="flex flex-col">
    {#if displayCloseButton}
      <div class="flex w-full flex-row justify-end">
        <button class="ml-auto p-2" on:click={closeDrawer}>
          <CloseIcon class="h-12 w-12" />
        </button>
      </div>
    {/if}
    <SideBarLink Icon={CalendarIcon} label="Summary" href="/summary" />
    <SideBarLink Icon={GroupsIcon} label="Groups" href="/groups" />
    <SideBarLink Icon={SettingsIcon} label="Settings" href="/settings" />
  </div>

  <div id="sidebar-footer-container" class="m-2 mt-auto">
    <SideBarFooter />
  </div>
</div>
