<script lang="ts">
  import type { ZotDate } from "$lib/utils/ZotDate";

  export let isHighlighted: boolean | null;
  export let calendarDay: ZotDate;
</script>

{#if isHighlighted}
  <div
    class="bg-primary-200 absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
  ></div>
{:else if calendarDay.isSelected}
  <div
    class="bg-primary-400 absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
  ></div>
{/if}

<p
  class="relative p-2 text-base font-medium text-gray-500"
  data-day={calendarDay.getDay()}
  data-month={calendarDay.getMonth()}
  data-year={calendarDay.getYear()}
  data-selected={calendarDay.isSelected}
>
  {calendarDay.getDay()}
</p>
