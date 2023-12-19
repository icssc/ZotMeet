<script lang="ts">
  import CalendarBodyDay from "$lib/components/Calendar/CalendarBodyDay.svelte";
  import { CalendarDay } from "$lib/components/Calendar/CalendarDay";
  import { updatedSelectedRange } from "$lib/stores/calendarStores";

  export let calendarDays: CalendarDay[][];
  export let updateCalendar: () => void = () => {};

  let startDaySelection: CalendarDay | null = null;
  let endDaySelection: CalendarDay | null = null;

  $: selectionIsReversed =
    startDaySelection && endDaySelection && startDaySelection > endDaySelection;

  const handleTouchMove = (e: TouchEvent): void => {
    const touchingElement: Element | null = document.elementFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY,
    );

    if (!touchingElement) return;

    const touchingDay = touchingElement.getAttribute("data-day");

    if (startDaySelection && touchingDay) {
      endDaySelection = CalendarDay.extractDayFromElement(touchingElement);
    }
  };

  const handleSelectEnd = (): void => {
    if (startDaySelection && endDaySelection) {
      let lowerBound = startDaySelection;
      let upperBound = endDaySelection;

      // If the user selects backwards, swap the selections so the start is earlier than the end
      if (startDaySelection > endDaySelection) {
        lowerBound = endDaySelection;
        upperBound = startDaySelection;
      }

      try {
        updatedSelectedRange(lowerBound, upperBound);
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
              handleSelectEnd();
            }
          }}
        >
          {#if calendarDay.day > 0}
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
                handleSelectEnd();
              }}
              tabindex="0"
              class="relative flex justify-center w-full cursor-pointer select-none"
            >
              {#if startDaySelection && endDaySelection}
                {@const toHighlightIfReversed =
                  endDaySelection.day <= calendarDay.day &&
                  calendarDay.day <= startDaySelection.day}
                {@const toHighlightIfNotReversed =
                  startDaySelection.day <= calendarDay.day &&
                  calendarDay.day <= endDaySelection.day}
                {@const isHighlighted = selectionIsReversed
                  ? toHighlightIfReversed
                  : toHighlightIfNotReversed}
                <CalendarBodyDay {isHighlighted} {calendarDay} />
              {:else}
                <CalendarBodyDay isHighlighted={false} {calendarDay} />
              {/if}
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
