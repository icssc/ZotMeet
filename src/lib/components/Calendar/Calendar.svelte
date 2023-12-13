<script lang="ts">
  import type { CalendarDay } from "./Calendar";

  import { generateCalendarDays } from "$lib/calendar";

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
  let monthIndex: number = today.getMonth();
  let currentYear: number = today.getFullYear();
  let calendarDays: CalendarDay[][] = generateCalendarDays(monthIndex, currentYear);

  $: currentMonth = months[monthIndex];

  const decrementMonth = () => {
    monthIndex--;
    if (monthIndex < 0) {
      monthIndex = 11;
      currentYear--;
    }

    calendarDays = generateCalendarDays(monthIndex, currentYear);
  };

  const incrementMonth = () => {
    monthIndex++;
    if (monthIndex > 11) {
      monthIndex = 0;
      currentYear++;
    }

    calendarDays = generateCalendarDays(monthIndex, currentYear);
  };

  //   console.log(monthIndex, currentYear, calendarDays);
</script>

<div class="max-w-xl p-5 mx-auto bg-surface-50">
  <p class="text-center h3">{currentMonth} {currentYear}</p>
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
      <tbody>
        {#each calendarDays as calendarWeek}
          <tr>
            {#each calendarWeek as calendarDay}
              <td class="pt-6">
                {#if calendarDay.day > 0}
                  <div class="flex justify-center w-full p-2 cursor-pointer">
                    <p class="text-base font-medium text-gray-500 select-none dark:text-gray-100">
                      {calendarDay.day}
                    </p>
                  </div>
                {:else}
                  <div class="p-2">
                    <p>&nbsp;</p>
                  </div>
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
    <button on:click={incrementMonth} class="p-3 pr-1">
      <span class="text-3xl text-gray-500">&rsaquo;</span>
    </button>
  </div>
</div>
