<script lang="ts">
  import AddBoxOutlineRounded from "~icons/material-symbols/add-box-outline-rounded";
  import CalendarIcon from "~icons/material-symbols/calendar-clock";
  import SettingsOutline from "~icons/material-symbols/settings-outline";
</script>

<div class="flex flex-col gap-y-2 border-t-2 px-6 pt-6 text-gray-600 sm:px-8 md:border-0 md:p-0">
  <a href="/">
    <button
      class="btn h-12 w-full justify-start space-x-3 border-none bg-transparent text-xl font-normal shadow-none md:text-lg"
    >
      <AddBoxOutlineRounded class="h-7 w-7" />
      <p>New Meeting</p>
    </button>
  </a>
  <a href="/summary">
    <button
      class="btn h-12 w-full justify-start space-x-3 border-none bg-transparent text-xl font-normal shadow-none md:text-lg"
    >
      <CalendarIcon class="h-7 w-7" />
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
