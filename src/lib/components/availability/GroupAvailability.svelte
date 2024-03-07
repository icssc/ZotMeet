<script lang="ts">
  import {
    availabilityDates,
    availabilityTimeBlocks,
    groupMembers,
  } from "$lib/stores/availabilityStores";
  import { ZotDate } from "$lib/utils/ZotDate";
  import { cn } from "$lib/utils/utils";

  export let columns: number;

  const itemsPerPage: number = columns;
  const lastPage: number = Math.floor(($availabilityDates.length - 1) / itemsPerPage);
  const numPaddingDates: number =
    $availabilityDates.length % itemsPerPage === 0
      ? 0
      : itemsPerPage - ($availabilityDates.length % itemsPerPage);

  let currentPage = 0;
  let currentPageAvailability: (ZotDate | null)[];

  // Triggers on every pagination change and selection confirmation
  $: {
    const datesToOffset = currentPage * itemsPerPage;
    currentPageAvailability = $availabilityDates.slice(datesToOffset, datesToOffset + itemsPerPage);

    console.log(currentPageAvailability);

    if (currentPage === lastPage) {
      currentPageAvailability = currentPageAvailability.concat(
        new Array(numPaddingDates).fill(null),
      );
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

  const getGroupBlockColor = (availableMemberIndices: number[] | null): string => {
    if (availableMemberIndices) {
      return `rgba(55, 124, 251, ${availableMemberIndices.length / $groupMembers.length})`;
    }
    return "transparent";
  };
</script>

<div class="flex items-center justify-between overflow-x-auto font-dm-sans">
  <button
    on:click={() => {
      if (currentPage > 0) {
        currentPage = currentPage - 1;
      }
    }}
    class="p-3 disabled:opacity-0 md:pl-1"
    disabled={currentPage === 0}
  >
    <span class="text-3xl text-gray-500">&lsaquo;</span>
  </button>

  <table class="w-full table-fixed">
    <thead>
      <tr>
        <th class="w-10 md:w-16"><span class="sr-only">Time</span></th>
        {#each currentPageAvailability as dateHeader}
          <th class="pb-2 text-sm font-normal">
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
              {@const availableMemberIndices = selectedDate.getGroupAvailabilityBlock(blockIndex)}

              <td class="px-0 py-0">
                <button
                  tabindex="0"
                  class={cn(
                    "block h-full w-full border-r-[1px] border-gray-medium",
                    isTopOfHour && "border-t-[1px] border-t-gray-medium",
                    isHalfHour && "border-t-[1px] border-t-gray-base",
                    isLastRow && "border-b-[1px]",
                  )}
                >
                  <div
                    class="block h-full w-full py-2"
                    style:background-color={getGroupBlockColor(availableMemberIndices)}
                  ></div>
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
    class="p-3 disabled:opacity-0 md:pr-1"
    disabled={currentPage === lastPage}
  >
    <span class="text-3xl text-gray-500">&rsaquo;</span>
  </button>
</div>
