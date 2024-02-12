<script lang="ts">
  import type { ZotDate } from "$lib/utils/ZotDate";

  export let isHighlighted: boolean | null;
  export let calendarDay: ZotDate;
</script>

{#if isHighlighted}
  <div
    class="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
  />
{:else if calendarDay.isSelected}
  <div
    class="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
  />
{/if}

<p
  class="relative text-base font-medium text-gray-500"
  data-day={calendarDay.getDay()}
  data-month={calendarDay.getMonth()}
  data-year={calendarDay.getYear()}
  data-selected={calendarDay.isSelected}
>
  {calendarDay.getDay()}
</p>
