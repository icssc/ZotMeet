<script lang="ts">
  import type { CalendarDay } from "$lib/components/Calendar/Calendar";
  import CalendarBodyDay from "$lib/components/Calendar/CalendarBodyDay.svelte";
  import { extractDayFromElement } from "$lib/utils/calendarUtils";

  export let calendarDays: CalendarDay[][];

  let startDaySelection: CalendarDay | null = null;
  let endDaySelection: CalendarDay | null = null;

  const handleTouchStart = (touchedDay: CalendarDay): void => {
    startDaySelection = touchedDay;
    console.log("touch start", startDaySelection.day);
  };

  const handleTouchMove = (e: TouchEvent): void => {
    const touchingElement: Element | null = document.elementFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY,
    );

    if (!touchingElement) return;

    const touchingDay = touchingElement?.getAttribute("data-day");

    if (startDaySelection && touchingDay) {
      endDaySelection = extractDayFromElement(touchingElement);
      console.log("touch move", startDaySelection, endDaySelection);
    }
  };

  const handleTouchEnd = (): void => {
    console.log("touch end");

    startDaySelection = null;
    endDaySelection = null;
  };
</script>

<tbody>
  {#each calendarDays as calendarWeek}
    <tr>
      {#each calendarWeek as calendarDay}
        <td class="pt-6">
          {#if calendarDay.day > 0}
            {@const isHighlighted =
              startDaySelection &&
              endDaySelection &&
              calendarDay.day >= startDaySelection.day &&
              calendarDay.day <= endDaySelection.day}
            <div
              on:touchstart={() => {
                handleTouchStart(calendarDay);
              }}
              on:touchmove={handleTouchMove}
              on:touchend={handleTouchEnd}
              class="relative flex justify-center w-full cursor-pointer select-none"
            >
              <CalendarBodyDay {isHighlighted} {calendarDay} />
            </div>
          {:else}
            <div class="select-none">
              <p class="p-2">&nbsp;</p>
            </div>
          {/if}
        </td>
      {/each}
    </tr>
  {/each}
</tbody>
