<script lang="ts">
  import CalendarBody from "./CalendarBody.svelte";

  import { selectedDays } from "$lib/stores/meetingSetupStores";
  import { WEEKDAYS, MONTHS } from "$lib/types/chrono";
  import { ZotDate } from "$lib/utils/ZotDate";

  let today: Date = new Date();
  let currentMonth: number = today.getMonth();
  let currentYear: number = today.getFullYear();
  let calendarDays: ZotDate[][] = ZotDate.generateZotDates(
    currentMonth,
    currentYear,
    $selectedDays,
  );

  $: monthName = MONTHS[currentMonth];

  const updateCalendar = (): void => {
    calendarDays = ZotDate.generateZotDates(currentMonth, currentYear, $selectedDays);
  };
  const decrementMonth = (): void => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }

    updateCalendar();
  };

  const incrementMonth = (): void => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }

    updateCalendar();
  };
</script>

<p class="h3 hidden text-center">{monthName} {currentYear}</p>

<div class="flex items-center justify-between overflow-x-auto pt-5">
  <button on:click={decrementMonth} class="p-3 pl-1">
    <span class="text-3xl text-gray-500">&lsaquo;</span>
  </button>

  <table class="w-full">
    <thead>
      <tr>
        {#each WEEKDAYS as dayOfWeek}
          <th>
            <div class="flex w-full justify-center">
              <p class="text-center text-base font-medium text-gray-800 dark:text-gray-100">
                {dayOfWeek}
              </p>
            </div>
          </th>
        {/each}
      </tr>
    </thead>
    <CalendarBody {calendarDays} {updateCalendar} {currentMonth} />
  </table>
  <button on:click={incrementMonth} class="p-3 pr-1">
    <span class="text-3xl text-gray-500">&rsaquo;</span>
  </button>
</div>
