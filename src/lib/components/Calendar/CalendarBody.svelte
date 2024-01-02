<script lang="ts">
  import CalendarBodyDay from "$lib/components/Calendar/CalendarBodyDay.svelte";
  import { Day } from "$lib/components/Calendar/CalendarDay";
  import { updatedSelectedRange } from "$lib/stores/calendarStores";

  export let calendarDays: Day[][];
  export let updateCalendar: () => void = () => {};

  let startDaySelection: Day | null = null;
  let endDaySelection: Day | null = null;

  /**
   * Updates the current highlight selection whenever a mobile user drags on the calendar
   * @param e a TouchEvent object from a mobile user
   */
  const handleTouchMove = (e: TouchEvent): void => {
    const touchingElement: Element | null = document.elementFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY,
    );

    if (!touchingElement) return;

    const touchingDay = touchingElement.getAttribute("data-day");

    if (startDaySelection && touchingDay) {
      endDaySelection = Day.extractDayFromElement(touchingElement);
    }
  };

  /**
   * Creates the selection of highlighted days and updates the calendar accordingly
   */
  const handleEndSelection = (): void => {
    if (startDaySelection && endDaySelection) {
      try {
        updatedSelectedRange(startDaySelection, endDaySelection);
      } catch (err) {
        console.error(err);
      }
    }

    updateCalendar();

    startDaySelection = null;
    endDaySelection = null;
  };
</script>

<tbody>
  {#each calendarDays as calendarWeek}
    <tr>
      {#each calendarWeek as calendarDay}
        <td
          class="py-3"
          on:mouseup={() => {
            if (startDaySelection) {
              endDaySelection = calendarDay;
              handleEndSelection();
            }
          }}
        >
          {#if calendarDay.day > 0}
            {@const isHighlighted =
              startDaySelection &&
              endDaySelection &&
              calendarDay.determineDayWithinBounds(startDaySelection, endDaySelection)}
            <button
              on:touchstart={(e) => {
                if (e.cancelable) {
                  e.preventDefault();
                }
                startDaySelection = calendarDay;
              }}
              on:mousedown={() => {
                startDaySelection = calendarDay;
              }}
              on:touchmove={handleTouchMove}
              on:mousemove={() => {
                if (startDaySelection) {
                  endDaySelection = calendarDay;
                }
              }}
              on:touchend={(e) => {
                if (e.cancelable) {
                  e.preventDefault();
                }
                if (!endDaySelection) {
                  endDaySelection = calendarDay;
                }
                handleEndSelection();
              }}
              tabindex="0"
              class="relative flex justify-center w-full cursor-pointer select-none"
            >
              <CalendarBodyDay {isHighlighted} {calendarDay} />
            </button>
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
