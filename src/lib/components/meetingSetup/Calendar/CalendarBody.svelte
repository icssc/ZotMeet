<script lang="ts">
  import CalendarBodyDay from "$lib/components/meetingSetup/Calendar/CalendarBodyDay.svelte";
  import { updateSelectedRange } from "$lib/stores/meetingSetupStores";
  import { ZotDate } from "$lib/utils/ZotDate";

  export let calendarDays: ZotDate[][];
  export let updateCalendar: () => void = () => {};
  export let currentMonth: number;

  let startDaySelection: ZotDate | null = null;
  let endDaySelection: ZotDate | null = null;

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
      endDaySelection = ZotDate.extractDayFromElement(touchingElement);
    }
  };

  /**
   * Creates the selectionupdateSelectedRange */
  const handleEndSelection = (): void => {
    if (startDaySelection && endDaySelection) {
      try {
        updateSelectedRange(startDaySelection, endDaySelection);
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
          {#if calendarDay.getMonth() === currentMonth}
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
              class="relative flex w-full cursor-pointer select-none justify-center"
            >
              <CalendarBodyDay {isHighlighted} {calendarDay} />
            </button>
          {:else}
            <div class="flex w-full select-none justify-center">
              <p class="p-2 text-surface-400">{calendarDay.getDay()}</p>
            </div>
          {/if}
        </td>
      {/each}
    </tr>
  {/each}
</tbody>
