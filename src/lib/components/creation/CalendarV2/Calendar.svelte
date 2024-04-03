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

<div
  class="flex items-center justify-between rounded-xl border bg-gradient-to-l from-[#00A96E0D] to-[#377CFB0D] py-7 md:p-5"
>
  <button on:click={decrementMonth} class="p-3 md:pl-1">
    <span class="text-3xl text-gray-500">&lsaquo;</span>
  </button>

  <div class="md:px-4">
    <div class="flex flex-col pb-5 md:pb-6">
      <h3 class="text-left font-montserrat text-2xl font-semibold text-gray-dark md:text-3xl">
        {monthName}
        {currentYear}
      </h3>
      <div class="divider m-0 h-[2px] w-12 bg-accent md:w-16" />
    </div>

    <table class="w-full table-fixed p-3">
      <thead>
        <tr>
          {#each WEEKDAYS as dayOfWeek}
            <th class="px-0">
              <div>
                <p
                  class="w-full text-center text-sm font-light uppercase text-slate-medium md:font-bold"
                >
                  {dayOfWeek}
                </p>
              </div>
              <div class="divider mt-0" />
            </th>
          {/each}
        </tr>
      </thead>

      <CalendarBody {calendarDays} {updateCalendar} {currentMonth} />
    </table>
  </div>

  <button on:click={incrementMonth} class="p-3 md:pr-1">
    <span class="text-3xl text-gray-500">&rsaquo;</span>
  </button>
</div>
