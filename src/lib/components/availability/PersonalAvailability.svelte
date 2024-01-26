<script lang="ts">
  import AvailabilityBlock from "$lib/components/availability/AvailabilityBlock.svelte";
  import type { AvailabilityBlockType, SelectionStateType } from "$lib/types/availability";
  import { TimeConstants } from "$lib/types/chrono";
  import { ZotDate } from "$lib/utils/ZotDate";

  // SET UP SAMPLE DATES
  const selectedZotDates = [
    new ZotDate(new Date("1 1 24")),
    new ZotDate(new Date("1 2 24")),
    new ZotDate(new Date("1 3 24")),
    new ZotDate(new Date("1 4 24")),
  ];
  const earliestTime = TimeConstants.MINUTES_PER_HOUR * 9;
  const latestTime = TimeConstants.MINUTES_PER_HOUR * 17.5;

  const sampleBlockLength = 15;

  const timeBlocks = ZotDate.initializeAvailabilities(
    selectedZotDates,
    earliestTime,
    latestTime,
    sampleBlockLength,
  );

  let startBlockSelection: AvailabilityBlockType | null = null;
  let endBlockSelection: AvailabilityBlockType | null = null;

  /**
   * Returns an updated pagination respective of the current states
   * @returns an array of the new page's ZotDates
   */
  const calculateNewPagination = (): ZotDate[] => {
    const firstItemOffset = currentPage * itemsPerPage;
    const lastItemOffset = firstItemOffset + itemsPerPage;
    return selectedZotDates.slice(firstItemOffset, lastItemOffset);
  };

  // Mobile Pagination
  const itemsPerPage = 3;
  let currentPage = 0;
  let currentPageZotDates: ZotDate[] = calculateNewPagination();

  // Because a user can select in two dimensions, need separate state to "maintain the correct orientation" of the min and max selection indices
  let selectionState: SelectionStateType | null = null;

  $: {
    if (startBlockSelection && endBlockSelection) {
      selectionState = {
        earlierDateIndex: Math.min(
          startBlockSelection.zotDateIndex,
          endBlockSelection.zotDateIndex,
        ),
        laterDateIndex: Math.max(startBlockSelection.zotDateIndex, endBlockSelection.zotDateIndex),
        earlierBlockIndex: Math.min(startBlockSelection.blockIndex, endBlockSelection.blockIndex),
        laterBlockIndex: Math.max(startBlockSelection.blockIndex, endBlockSelection.blockIndex),
      };
    }
  }

  /**
   * Updates the current selection whenever a mobile user drags over a block
   * @param e a TouchEvent object from a mobile user
   */
  const handleTouchMove = (e: TouchEvent): void => {
    const touchingElement: Element | null = document.elementFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY,
    );

    if (!touchingElement) return;

    const touchingDateIndex = parseInt(touchingElement.getAttribute("data-date-index") ?? "");
    const touchingBlockIndex = parseInt(touchingElement.getAttribute("data-block-index") ?? "");

    if (
      !Number.isNaN(touchingDateIndex) &&
      !Number.isNaN(touchingBlockIndex) &&
      startBlockSelection
    ) {
      endBlockSelection = {
        zotDateIndex: touchingDateIndex,
        blockIndex: touchingBlockIndex,
      };
    }
  };

  /**
   * Modifies the selected meeting date availabilities according to the current selection
   * @param startBlock the time block that the user originated the selection
   */
  const setAvailabilities = (startBlock: AvailabilityBlockType): void => {
    if (selectionState) {
      console.log("setting availabilities");
      const { earlierDateIndex, laterDateIndex, earlierBlockIndex, laterBlockIndex } =
        selectionState;
      const { zotDateIndex: selectionStartDateIndex, blockIndex: selectionStartBlockIndex } =
        startBlock;

      // Determine behavior of the selection (starting on selected = unselect all, start on unselected = select all)
      const startSelectionZotDate = selectedZotDates[selectionStartDateIndex];
      const selectionValue: boolean =
        !startSelectionZotDate.getBlockAvailability(selectionStartBlockIndex);

      for (let dateIndex = earlierDateIndex; dateIndex <= laterDateIndex; dateIndex++) {
        const currentDate = selectedZotDates[dateIndex];
        currentDate.setBlockAvailabilities(earlierBlockIndex, laterBlockIndex, selectionValue);
      }

      // Update Svelte states
      currentPageZotDates = currentPageZotDates;
      startBlockSelection = null;
      endBlockSelection = null;
      selectionState = null;
    }
  };
</script>

<div class="p-5">
  <div class="flex items-center justify-between overflow-x-auto pt-5">
    <button
      on:click={() => {
        if (currentPage > 0) {
          currentPage = currentPage - 1;
          currentPageZotDates = calculateNewPagination();
        }
      }}
      class="p-3 pl-1"
    >
      <span class="text-3xl text-gray-500">&lsaquo;</span>
    </button>
    <table class="w-full table-fixed">
      <thead>
        <tr>
          <th><span class="sr-only">Time</span></th>
          {#each currentPageZotDates as { day }}
            <th class="text-sm font-normal">
              {day.toLocaleDateString("en-US", {
                weekday: "short",
                month: "numeric",
                day: "numeric",
              })}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each timeBlocks as timeBlock, blockIndex (`block-${timeBlock}`)}
          {@const isTopOfHour = timeBlock % 60 === 0}
          {@const isHalfHour = timeBlock % 60 === 30}
          {@const isLastRow = blockIndex === timeBlocks.length - 1}
          <tr>
            <td class="border-r-2 border-r-neutral-800 py-0 pr-1 align-top">
              {#if isTopOfHour}
                <span class="float-right whitespace-nowrap text-xs">
                  {ZotDate.toTimeBlockString(timeBlock)}
                </span>
              {/if}
            </td>
            {#each currentPageZotDates as selectedDate, pageDateIndex (`date-${selectedDate.valueOf()}-${timeBlock}`)}
              {@const zotDateIndex = pageDateIndex + currentPage * itemsPerPage}
              {@const availabilitySelection = {
                zotDateIndex: zotDateIndex,
                blockIndex: blockIndex,
              }}
              {@const isAvailable = selectedDate.getBlockAvailability(blockIndex)}
              <td
                on:mouseup={() => {
                  if (startBlockSelection) {
                    endBlockSelection = availabilitySelection;
                    setAvailabilities(startBlockSelection);
                  }
                }}
                class="px-0 py-0"
              >
                <button
                  on:touchstart={(e) => {
                    if (e.cancelable) {
                      e.preventDefault();
                    }
                    startBlockSelection = availabilitySelection;
                    endBlockSelection = availabilitySelection;
                  }}
                  on:mousedown={() => {
                    startBlockSelection = availabilitySelection;
                    endBlockSelection = availabilitySelection;
                  }}
                  on:touchmove={handleTouchMove}
                  on:mousemove={() => {
                    if (startBlockSelection) {
                      endBlockSelection = availabilitySelection;
                    }
                  }}
                  on:touchend={(e) => {
                    if (e.cancelable) {
                      e.preventDefault();
                    }
                    if (startBlockSelection) {
                      endBlockSelection = availabilitySelection;
                      setAvailabilities(startBlockSelection);
                    }
                  }}
                  tabindex="0"
                  class={`block h-full w-full ${isTopOfHour && "border-t-2 border-t-neutral-800"} ${
                    isHalfHour && "border-t-[1px] border-t-neutral-600"
                  } ${isLastRow && "border-b-2"} cursor-row-resize border-r-2 border-neutral-600`}
                >
                  <AvailabilityBlock {isAvailable} {zotDateIndex} {blockIndex} {selectionState} />
                </button>
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
    <button
      class="p-3 pr-1"
      on:click={() => {
        const lastPage = Math.floor((selectedZotDates.length - 1) / itemsPerPage);
        if (currentPage < lastPage) {
          currentPage = currentPage + 1;
          currentPageZotDates = calculateNewPagination();
        }
      }}
    >
      <span class="text-3xl text-gray-500">&rsaquo;</span>
    </button>
  </div>
</div>
