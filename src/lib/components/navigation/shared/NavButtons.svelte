<script lang="ts">
  import NavButton from "./NavButton.svelte";

  import AddBoxOutlineIcon from "~icons/material-symbols/add-box-outline";
  import CalendarSearchOutlineIcon from "~icons/mdi/calendar-search-outline";
  import SettingsOutline from "~icons/mdi/settings-outline";
</script>

<div class="flex flex-col gap-y-2 border-t-2 px-6 pt-6 text-gray-600 sm:px-8 md:border-0 md:p-0">
  <NavButton text="New Meeting" , href="/">
    <AddBoxOutlineIcon class="h-7 w-7" />
  </NavButton>

  <NavButton text="Summary" , href="/summary">
    <CalendarSearchOutlineIcon class="h-7 w-7" />
  </NavButton>

  <NavButton text="Settings" , href="/settings">
    <SettingsOutline class="h-7 w-7" />
  </NavButton>
</div>
