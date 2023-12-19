<script lang="ts">
  import CalendarBody from "$lib/components/Calendar/CalendarBody.svelte";
  import { DAYS_OF_WEEK, MONTHS, CalendarDay } from "$lib/components/Calendar/CalendarDay";
  import { selectedDays } from "$lib/stores/calendarStores";

  let today: Date = new Date();
  let currentMonth: number = today.getMonth();
  let currentYear: number = today.getFullYear();
  let calendarDays: CalendarDay[][] = CalendarDay.generateCalendarDays(
    currentMonth,
    currentYear,
    $selectedDays,
  );

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
    calendarDays = CalendarDay.generateCalendarDays(currentMonth, currentYear, $selectedDays);
  };
</script>

<div class="max-w-xl p-5 mx-auto bg-surface-50">
  <p class="text-center h3">{monthName} {currentYear}</p>
  <div class="flex items-center justify-between pt-5 overflow-x-auto">
    <button on:click={decrementMonth} class="p-3 pl-1">
      <span class="text-3xl text-gray-500">&lsaquo;</span>
    </button>
    <table class="w-full">
      <thead>
        <tr>
          {#each DAYS_OF_WEEK as dayOfWeek}
            <th>
              <div class="flex justify-center w-full">
                <p class="text-base font-medium text-center text-gray-800 dark:text-gray-100">
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
</div>
