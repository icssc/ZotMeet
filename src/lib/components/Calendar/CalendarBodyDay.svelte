<script lang="ts">
  import type { CalendarDay } from "$lib/components/Calendar/CalendarDay";

  export let isHighlighted: boolean | null;
  export let calendarDay: CalendarDay;
</script>

{#if isHighlighted}
  <div
    class="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-200 top-1/2 left-1/2"
  ></div>
{:else if calendarDay.isSelected}
  <div
    class="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400 top-1/2 left-1/2"
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
