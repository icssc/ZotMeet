<script lang="ts">
  import type { ZotDate } from "$lib/utils/ZotDate";

  export let isHighlighted: boolean | null;
  export let calendarDay: ZotDate;
</script>

<p
  class="flex-center relative aspect-square h-8 w-8 text-base font-medium text-gray-dark md:h-12 md:w-12 md:text-xl"
  class:day-selected={calendarDay.isSelected}
  class:day-highlighted={isHighlighted}
  data-day={calendarDay.getDay()}
  data-month={calendarDay.getMonth()}
  data-year={calendarDay.getYear()}
  data-selected={calendarDay.isSelected}
>
  {calendarDay.getDay()}
</p>

<style lang="postcss">
  .day-selected {
    @apply rounded-lg bg-primary text-gray-light md:rounded-xl md:drop-shadow-[0_0px_16px_rgba(55,124,251,0.4)];
  }

  .day-highlighted {
    @apply rounded-lg bg-slate-base text-gray-dark drop-shadow-none md:rounded-xl;
  }
</style>
