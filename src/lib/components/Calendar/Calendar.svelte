<script lang="ts">
  import type { CalendarDay } from "./Calendar";

  import CalendarBody from "$lib/components/Calendar/CalendarBody.svelte";
  import { generateCalendarDays } from "$lib/utils/calendarUtils";

  const daysOfWeek: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ] as const;

  let today: Date = new Date();
  let currentMonth: number = today.getMonth();
  let currentYear: number = today.getFullYear();
  let calendarDays: CalendarDay[][] = generateCalendarDays(currentMonth, currentYear);

  $: monthName = months[currentMonth];

  const decrementMonth = () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }

    calendarDays = generateCalendarDays(currentMonth, currentYear);
  };

  const incrementMonth = () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }

    calendarDays = generateCalendarDays(currentMonth, currentYear);
  };

  //   console.log(monthIndex, currentYear, calendarDays);
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
          {#each daysOfWeek as dayOfWeek}
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
      <CalendarBody {calendarDays} />
    </table>
    <button on:click={incrementMonth} class="p-3 pr-1">
      <span class="text-3xl text-gray-500">&rsaquo;</span>
    </button>
  </div>
</div>
