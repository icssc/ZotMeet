<script lang="ts">
  import CalendarBody from "./CalendarBody.svelte";
  import { Day } from "./CalendarDay";

  import { selectedDays } from "$lib/stores/meetingSetupStores";
  import { WEEKDAYS, MONTHS } from "$lib/types/chrono";

  let today: Date = new Date();
  let currentMonth: number = today.getMonth();
  let currentYear: number = today.getFullYear();
  let calendarDays: Day[][] = Day.generateCalendarDays(currentMonth, currentYear, $selectedDays);

  $: monthName = MONTHS[currentMonth];

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

  const updateCalendar = (): void => {
    calendarDays = Day.generateCalendarDays(currentMonth, currentYear, $selectedDays);
  };
</script>

<p class="h3 text-center">{monthName} {currentYear}</p>
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
    <CalendarBody {calendarDays} {updateCalendar} />
  </table>
  <button on:click={incrementMonth} class="p-3 pr-1">
    <span class="text-3xl text-gray-500">&rsaquo;</span>
  </button>
</div>
