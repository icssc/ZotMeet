<script lang="ts">
  import type { ZotDate } from "$lib/utils/ZotDate";
  import { cn } from "$lib/utils/utils";

  export let isHighlighted: boolean | null;
  export let calendarDay: ZotDate;
</script>

<p
  class={cn(
    "flex-center relative aspect-square h-12 w-12 text-xl font-medium text-gray-dark",
    calendarDay.isSelected &&
      "rounded-xl bg-primary text-gray-light drop-shadow-[0_0px_16px_rgba(55,124,251,0.6)]",
    isHighlighted && "rounded-xl bg-slate-base text-gray-dark drop-shadow-none",
  )}
  data-day={calendarDay.getDay()}
  data-month={calendarDay.getMonth()}
  data-year={calendarDay.getYear()}
  data-selected={calendarDay.isSelected}
>
  {calendarDay.getDay()}
</p>
