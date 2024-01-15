<script lang="ts">
  import type { Day } from "./CalendarDay";

  export let isHighlighted: boolean | null;
  export let calendarDay: Day;
</script>

{#if isHighlighted}
  <div
    class="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-200"
  ></div>
{:else if calendarDay.isSelected}
  <div
    class="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400"
  ></div>
{/if}
<p
  class="relative p-2 text-base font-medium text-gray-500"
  data-day={calendarDay.day}
  data-month={calendarDay.month}
  data-year={calendarDay.year}
  data-selected={calendarDay.isSelected}
>
  {calendarDay.day}
</p>
