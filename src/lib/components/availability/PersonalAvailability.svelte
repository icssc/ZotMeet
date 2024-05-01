<script lang="ts">
  import { onMount } from "svelte";

  import type { PageData } from "../../../routes/availability/$types";

  import LoginFlow from "./LoginModal.svelte";

  import AvailabilityBlock from "$lib/components/availability/AvailabilityBlock.svelte";
  import {
    availabilityDates,
    availabilityTimeBlocks,
    guestSession,
    isEditingAvailability,
    isStateUnsaved,
  } from "$lib/stores/availabilityStores";
  import type { AvailabilityBlockType, SelectionStateType } from "$lib/types/availability";
  import { ZotDate } from "$lib/utils/ZotDate";
  import { getGeneralAvailability } from "$lib/utils/availability";
  import { cn } from "$lib/utils/utils";

  export let columns: number;
  export let data: PageData;

  let itemsPerPage: number = columns;
  $: {
    itemsPerPage = columns;
  }

  const lastPage: number = Math.floor(($availabilityDates.length - 1) / itemsPerPage);
  const numPaddingDates: number =
    $availabilityDates.length % itemsPerPage === 0
      ? 0
      : itemsPerPage - ($availabilityDates.length % itemsPerPage);

  let startBlockSelection: AvailabilityBlockType | null = null;
  let endBlockSelection: AvailabilityBlockType | null = null;

  let currentPage = 0;

  let currentPageAvailability: (ZotDate | null)[];

  let selectionState: SelectionStateType | null = null;

  // Triggers on every pagination change and selection confirmation
  $: {
    const datesToOffset = currentPage * itemsPerPage;

    currentPageAvailability = $availabilityDates.slice(datesToOffset, datesToOffset + itemsPerPage);

    if (currentPage === lastPage) {
      currentPageAvailability = currentPageAvailability.concat(
        new Array(numPaddingDates).fill(null),
      );
    }
  }

  // Because a user can select in two dimensions, need separate state to keep track of the
  // "correct orientation" of the min and max selection indices
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

  const generateDateKey = (
    selectedDate: ZotDate | null,
    timeBlock: number,
    pageDateIndex: number,
  ): string => {
    return selectedDate
      ? `date-${selectedDate.valueOf()}-${timeBlock}`
      : `padding-${pageDateIndex}`;
  };

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
    if (!$isEditingAvailability) {
      $isEditingAvailability = true;
    }

    if (selectionState) {
      // Destructure user's selection state
      const { earlierDateIndex, laterDateIndex, earlierBlockIndex, laterBlockIndex } =
        selectionState;
      const { zotDateIndex: selectionStartDateIndex, blockIndex: selectionStartBlockIndex } =
        startBlock;

      // Determine behavior of the selection
      const startSelectionZotDate = $availabilityDates[selectionStartDateIndex];
      const selectionValue: boolean =
        !startSelectionZotDate.getBlockAvailability(selectionStartBlockIndex);

      availabilityDates.update((currentAvailabilityDates: ZotDate[]) => {
        for (let dateIndex = earlierDateIndex; dateIndex <= laterDateIndex; dateIndex++) {
          const currentDate = currentAvailabilityDates[dateIndex];
          currentDate.setBlockAvailabilities(earlierBlockIndex, laterBlockIndex, selectionValue);
        }

        return currentAvailabilityDates;
      });

      startBlockSelection = null;
      endBlockSelection = null;
      selectionState = null;

      $isStateUnsaved = true;
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", (event) => {
      if ($isStateUnsaved) {
        event.returnValue = `Are you sure you want to leave? You have unsaved changes!`;
      }
    });
  }

  onMount(async () => {
    $guestSession.meetingId = data.meetingId;

    const generalAvailability = await getGeneralAvailability(data, $guestSession);
    const defaultMeetingDates = data.defaultDates.map((item) => new ZotDate(item.date, false, []));
    ZotDate.initializeAvailabilities(defaultMeetingDates);

    console.log(generalAvailability, defaultMeetingDates);

    $availabilityDates =
      generalAvailability && generalAvailability.length > 0
        ? generalAvailability
        : defaultMeetingDates;
  });
</script>

<div class="flex items-center justify-between overflow-x-auto font-dm-sans">
  <button
    on:click={() => {
      if (currentPage > 0) {
        currentPage = currentPage - 1;
      }
    }}
    class="p-3 pl-0 disabled:opacity-0 md:pl-1"
    disabled={currentPage === 0}
  >
    <span class="text-3xl text-gray-500">&lsaquo;</span>
  </button>

  <table class="w-full table-fixed">
    <thead>
      <tr>
        <th class="w-10 md:w-16"><span class="sr-only">Time</span></th>
        {#each currentPageAvailability as dateHeader}
          <th class="text-sm font-normal">
            {#if dateHeader}
              <div class="flex flex-col">
                <span class="text-[10px] font-bold uppercase text-gray-500 md:text-xs">
                  {dateHeader.day.toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </span>

                <span class="text-center text-[12px] uppercase text-gray-medium md:text-base">
                  {dateHeader.day.toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                  })}
                </span>
              </div>
            {/if}
          </th>
        {/each}
      </tr>
    </thead>

    <tr class="h-2" />

    <tbody>
      {#each $availabilityTimeBlocks as timeBlock, blockIndex (`block-${timeBlock}`)}
        {@const isTopOfHour = timeBlock % 60 === 0}
        {@const isHalfHour = timeBlock % 60 === 30}
        {@const isLastRow = blockIndex === $availabilityTimeBlocks.length - 1}
        <tr>
          <td class="w-2 border-r-[1px] border-r-gray-medium py-0 pr-3 align-top">
            {#if isTopOfHour}
              <span
                class="float-right hidden whitespace-nowrap text-[10px] font-bold text-gray-medium md:flex md:text-xs"
              >
                {ZotDate.toTimeBlockString(timeBlock, false)}
              </span>
              <span
                class="float-right flex whitespace-nowrap text-[10px] font-bold text-gray-medium md:hidden md:text-xs"
              >
                {ZotDate.toTimeBlockString(timeBlock, true)}
              </span>
            {/if}
          </td>

          {#each currentPageAvailability as selectedDate, pageDateIndex (generateDateKey(selectedDate, timeBlock, pageDateIndex))}
            {#if selectedDate}
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
                  class={cn(
                    "block h-full w-full cursor-row-resize border-r-[1px] border-gray-medium",
                    isTopOfHour && "border-t-[1px] border-t-gray-medium",
                    isHalfHour && "border-t-[1px] border-t-gray-base",
                    isLastRow && "border-b-[1px]",
                  )}
                >
                  <AvailabilityBlock {isAvailable} {zotDateIndex} {blockIndex} {selectionState} />
                </button>
              </td>
            {:else}
              <td></td>
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>

  <button
    on:click={() => {
      if (currentPage < lastPage) {
        currentPage = currentPage + 1;
      }
    }}
    class="p-3 pr-0 disabled:opacity-0 md:pr-1"
    disabled={currentPage === lastPage}
  >
    <span class="text-3xl text-gray-500">&rsaquo;</span>
  </button>
</div>

<LoginFlow {data} />
