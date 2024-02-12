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
  class="flex items-center justify-between rounded-xl border bg-gradient-to-l from-[#00A96E0D] to-[#377CFB0D] p-5"
>
  <button on:click={decrementMonth} class="p-3 pl-1">
    <span class="text-3xl text-gray-500">&lsaquo;</span>
  </button>

  <div>
    <div class="flex flex-col pb-6">
      <p class="h3 text-left font-montserrat text-3xl font-semibold">{monthName} {currentYear}</p>
      <div class="divider m-0 h-[2px] w-16 bg-accent" />
    </div>

    <table class="w-full table-fixed p-3">
      <thead>
        <tr>
          {#each WEEKDAYS as dayOfWeek}
            <th class="px-0">
              <div>
                <p class="w-full text-center text-sm font-bold uppercase text-slate-medium">
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

  <button on:click={incrementMonth} class="p-3 pr-1">
    <span class="text-3xl text-gray-500">&rsaquo;</span>
  </button>
</div>
