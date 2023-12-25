<script lang="ts">
  import SideBarFooter from "./SideBarFooter.svelte";
  import SideBarLink from "./SideBarLink.svelte";

  import CalendarIcon from "~icons/material-symbols/calendar-clock";
  import SettingsIcon from "~icons/material-symbols/settings-rounded";
</script>

<div
  id="sidebar"
  class="flex flex-col bg-secondary-400 outline-secondary-800 rounded-lg card outline-5 h-full w-full"
>
  <div class="user-info flex justify-left gap-2 m-3 ml-4">
    <img src="user-icon.png" alt="User Icon" class="user-icon rounded-full w-1/5" />
    <div class="user-name align-text-bottom flex-col content-center justify-center inline-grid">
      <span class="text-lg">Peter Anteater</span>
    </div>
  </div>

  <div id="sidebar-links" class="flex flex-col">
    <SideBarLink Icon={CalendarIcon} label="Summary" href="/summary" />
    <SideBarLink Icon={SettingsIcon} label="Settings" href="/settings" />
  </div>

  <div id="sidebar-footer-container" class="mt-auto m-2">
    <SideBarFooter />
  </div>
</div>
