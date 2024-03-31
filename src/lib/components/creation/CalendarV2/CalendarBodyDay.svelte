<script lang="ts">
  import type { ZotDate } from "$lib/utils/ZotDate";
  import { cn } from "$lib/utils/utils";

  export let isHighlighted: boolean | null;
  export let calendarDay: ZotDate;
  export let isCurrentMonth: boolean;

  $: isSelected = calendarDay.isSelected;
</script>

<p
  class={cn(
    "flex-center relative aspect-square h-8 w-8 rounded-lg text-base font-medium text-gray-dark md:h-12 md:w-12 md:rounded-xl md:text-xl",
    isSelected && "bg-primary text-gray-light drop-shadow-[0_0px_16px_rgba(55,124,251,0.4)]",
    isHighlighted && "bg-slate-base text-gray-dark drop-shadow-none",
    !isCurrentMonth &&
      cn("text-gray-base", isHighlighted && "bg-opacity-30", isSelected && "bg-opacity-50"),
  )}
  data-day={calendarDay.getDay()}
  data-month={calendarDay.getMonth()}
  data-year={calendarDay.getYear()}
  data-selected={isSelected}
>
  {calendarDay.getDay()}
</p>
