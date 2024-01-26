<script lang="ts">
  /**
   *
   * array of selectedDays makes a table, which is array of availability
   * Intended behavior:
   * 1. can set beginning and end time, each row is 30 minutes ? or 1 hr
   * 2. Drag behavior depends on initial block selection -
   *  initial block selected -> unselects everything
   *  initial block not selected -> selects everything
   */
  import AvailabilityBlock from "$lib/components/availability/AvailabilityBlock.svelte";
  import type { AvailabilityBlockType, SelectionStateType } from "$lib/types/availability";
  import { TimeConstants } from "$lib/types/chrono";
  import { ZotDate } from "$lib/utils/ZotDate";

  // SET UP SAMPLE DATES
  let selectedZotDates = [
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

  console.log(selectedZotDates);
  console.log(timeBlocks.map((block) => ZotDate.toTimeBlockString(block)));

  let startBlockSelection: AvailabilityBlockType | null = null;
  let endBlockSelection: AvailabilityBlockType | null = null;

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
      selectedZotDates = selectedZotDates;
      startBlockSelection = null;
      endBlockSelection = null;
      selectionState = null;
    }
  };
</script>

<div class="p-5">
  <div class="flex items-center justify-between overflow-x-auto pt-5">
    <button class="p-3 pl-1">
      <span class="text-3xl text-gray-500">&lsaquo;</span>
    </button>
    <table class="w-full table-fixed">
      <thead>
        <tr>
          <th><span class="sr-only">Time</span></th>
          {#each selectedZotDates as { day }}
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
            <td class="py-0 pr-1 align-top">
              {#if isTopOfHour}
                <span class="float-right whitespace-nowrap text-xs">
                  {ZotDate.toTimeBlockString(timeBlock)}
                </span>
              {/if}
            </td>
            {#each selectedZotDates as selectedDate, zotDateIndex (`date-${selectedDate.valueOf()}-${timeBlock}`)}
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
                  } ${zotDateIndex === 0 && "border-l-2"} ${
                    isLastRow && "border-b-2"
                  } cursor-row-resize border-r-2 border-neutral-600`}
                >
                  <AvailabilityBlock {isAvailable} {zotDateIndex} {blockIndex} {selectionState} />
                </button>
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
    <button class="p-3 pr-1">
      <span class="text-3xl text-gray-500">&rsaquo;</span>
    </button>
  </div>
</div>
