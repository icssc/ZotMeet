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
  // import { selectedAvailability } from "$lib/stores/availabilityStores";

  // let givenDays: string[] = ["2024-01-10", "2024-01-11", "2024-01-13", "2024-01-15", "2024-01-17"];
  // $: selectedAvailability;
  // selectedAvailability.initialize(givenDays);

  // const constructAvailability = (): boolean[][] => {
  //   return $selectedAvailability.map((av) => av.getAvailabilities())
  // }
  import AvailabilityBlock from "$lib/components/availability/AvailabilityBlock.svelte";
  import type { AvailabilityType, SelectionStateType } from "$lib/types/availability";
  import { TimeConstants } from "$lib/types/chrono";
  import { ZotDate } from "$lib/utils/ZotDate";

  // SET UP SAMPLE DATES
  let selectedZotDates = [
    new ZotDate(new Date("1 3 24")),
    new ZotDate(new Date("1 2 24")),
    new ZotDate(new Date("1 1 24")),
  ];
  const earliestTime = TimeConstants.MINUTES_PER_HOUR * 11;
  const latestTime = TimeConstants.MINUTES_PER_HOUR * 14;

  const sampleBlockLength = 15;

  const timeBlocks = ZotDate.initializeAvailabilities(
    selectedZotDates,
    earliestTime,
    latestTime,
    sampleBlockLength,
  );

  // 11:00 am -> 2:00pm, 15 min blocks
  console.log(selectedZotDates);
  console.log(timeBlocks.map((block) => ZotDate.toTimeBlockString(block)));

  let startBlockSelection: AvailabilityType | null = null;
  let endBlockSelection: AvailabilityType | null = null;

  // Because a user can select in two dimensions, need separate state to store the min and max selection indices
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

  // const updateAvailabilities = (startBlock: AvailabilityType, endBlock: AvailabilityType): void => {
  //   // If  user selects to the left (previous column) or up (previous row), want to ensure early index is <= late index
  // };
</script>

<div class="bg-surface-50 p-5">
  <div class="flex items-center justify-between overflow-x-auto pt-5">
    <button class="p-3 pl-1">
      <span class="text-3xl text-gray-500">&lsaquo;</span>
    </button>
    <table class="w-full">
      <thead>
        <tr>
          <th><span class="sr-only">Time</span></th>
          {#each selectedZotDates as { day }}
            <th>
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
          <tr>
            <td class="py-0 pr-1 align-top">
              {#if isTopOfHour}
                <span class="float-right text-xs">
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
                    console.log("end", startBlockSelection, endBlockSelection);
                    startBlockSelection = null;
                    endBlockSelection = null;
                    selectionState = null;
                  }
                }}
                class="px-0 py-0"
              >
                <button
                  on:touchstart={(e) => {
                    if (e.cancelable) {
                      e.preventDefault();
                    }
                  }}
                  on:mousedown={() => {
                    startBlockSelection = availabilitySelection;
                  }}
                  on:touchmove={() => {}}
                  on:mousemove={() => {
                    if (startBlockSelection) {
                      // console.log("move", startBlockSelection, endBlockSelection);
                      endBlockSelection = availabilitySelection;
                      // updateAvailabilities(startBlockSelection, endBlockSelection);
                    }
                  }}
                  on:touchend={(e) => {
                    if (e.cancelable) {
                      e.preventDefault();
                    }
                  }}
                  tabindex="0"
                  class={`block h-full w-full ${
                    isTopOfHour && "border-t-neutral-800"
                  } border-2 border-b-0 border-neutral-500 `}
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
  <!-- <div>
    <p>early date: {selectionState?.earlierDateIndex}</p>
    <p>late date: {selectionState?.laterDateIndex}</p>
    <p>early block: {selectionState?.earlierBlockIndex}</p>
    <p>late block: {selectionState?.laterBlockIndex}</p>
  </div> -->
</div>
