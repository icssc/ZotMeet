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

  let today: Date = new Date(2023, 8);
  let monthIndex: number = today.getMonth();
  let currentYear: number = today.getFullYear();
  let calendarDays: CalendarDay[][] = generateCalendarDays(monthIndex, currentYear);

  $: currentMonth = months[monthIndex];

  //   console.log(monthIndex, currentYear, calendarDays);
</script>

<div class="max-w-xl p-5 mx-auto bg-surface-50">
  <p class="text-center h3">{currentMonth} {currentYear}</p>
  <div class="flex items-center justify-between pt-5 overflow-x-auto">
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
                <div class="flex justify-center w-full px-2 py-2 cursor-pointer">
                  {#if calendarDay.day > 0}
                    <p class="text-base font-medium text-gray-500 dark:text-gray-100">
                      {calendarDay.day}
                    </p>
                  {/if}
                </div>
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
