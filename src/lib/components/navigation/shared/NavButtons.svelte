<script lang="ts">
  import AddBoxOutlineIcon from "~icons/material-symbols/add-box-outline";
  import CalendarSearchOutlineIcon from "~icons/mdi/calendar-search-outline";
  import SettingsOutline from "~icons/mdi/settings-outline";
</script>

<div class="flex flex-col gap-y-2 border-t-2 px-6 pt-6 text-gray-600 sm:px-8 md:border-0 md:p-0">
  <a href="/">
    <button
      class="btn h-12 w-full justify-start space-x-3 border-none bg-transparent text-xl font-normal shadow-none md:text-lg"
    >
      <AddBoxOutlineIcon class="h-7 w-7" />
      <p>New Meeting</p>
    </button>
  </a>
  <a href="/summary">
    <button
      class="btn h-12 w-full justify-start space-x-3 border-none bg-transparent text-xl font-normal shadow-none md:text-lg"
    >
      <CalendarSearchOutlineIcon class="h-7 w-7" />
      <p>Summary</p>
    </button>
  </a>
  <a href="/settings">
    <button
      class="btn h-12 w-full justify-start space-x-3 border-none bg-transparent text-xl font-normal shadow-none md:text-lg"
    >
      <SettingsOutline class="h-7 w-7" />
      <p>Settings</p>
    </button>
  </a>
</div>
