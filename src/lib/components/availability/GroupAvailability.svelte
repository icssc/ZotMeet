<script lang="ts">
  import {
    availabilityDates,
    availabilityTimeBlocks,
    groupMembers,
  } from "$lib/stores/availabilityStores";
  import { ZotDate } from "$lib/utils/ZotDate";
  import { cn } from "$lib/utils/utils";
  import MdiClose from "~icons/mdi/close";

  export let columns: number;

  const itemsPerPage: number = columns;
  const lastPage: number = Math.floor(($availabilityDates.length - 1) / itemsPerPage);
  const numPaddingDates: number =
    $availabilityDates.length % itemsPerPage === 0
      ? 0
      : itemsPerPage - ($availabilityDates.length % itemsPerPage);

  let currentPage = 0;
  let currentPageAvailability: (ZotDate | null)[];
  let isMobileDrawerOpen: boolean = false;
  let selectedZotDateIndex: number | null = null;
  let selectedBlockIndex: number | null = null;
  let availableMembersOfSelection: string[] = [];
  let notAvailableMembersOfSelection: string[] = [];

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

  // Triggers on every selection change
  $: {
    if (selectedZotDateIndex !== null && selectedBlockIndex !== null) {
      const availableMemberIndices: number[] =
        $availabilityDates[selectedZotDateIndex].getGroupAvailabilityBlock(selectedBlockIndex) ??
        [];

      availableMembersOfSelection = availableMemberIndices.map(
        (availableMemberIndex) => $groupMembers[availableMemberIndex].name,
      );

      notAvailableMembersOfSelection = $groupMembers
        .filter((_, index) => !availableMemberIndices.includes(index))
        .map((notAvailableMember) => notAvailableMember.name);
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

  const updateSelection = (zotDateIndex: number, blockIndex: number): void => {
    isMobileDrawerOpen = true;
    selectedZotDateIndex = zotDateIndex;
    selectedBlockIndex = blockIndex;
  };

  const closeMobileDrawer = () => {
    isMobileDrawerOpen = false;
    selectedZotDateIndex = null;
    selectedBlockIndex = null;
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
              {@const zotDateIndex = pageDateIndex + currentPage * itemsPerPage}
              {@const availableMemberIndices = selectedDate.getGroupAvailabilityBlock(blockIndex)}
              {@const isSelected =
                selectedZotDateIndex === zotDateIndex && selectedBlockIndex === blockIndex}

              <td class="px-0 py-0">
                <button
                  tabindex="0"
                  class={cn(
                    "block h-full w-full border-r-[1px] border-gray-medium",
                    isTopOfHour && "border-t-[1px] border-t-gray-medium",
                    isHalfHour && "border-t-[1px] border-t-gray-base",
                    isLastRow && "border-b-[1px]",
                    isSelected && "outline-dashed outline-2 outline-slate-500",
                  )}
                  on:click={() => updateSelection(zotDateIndex, blockIndex)}
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

<div
  class={cn(
    "fixed bottom-0 left-0 h-96 w-full translate-y-full rounded-t-xl border-[1px] border-gray-400 bg-gray-100 bg-opacity-90 backdrop-blur-sm transition-transform duration-500 ease-in-out md:hidden",
    isMobileDrawerOpen && "translate-y-0",
  )}
>
  <div class="flex items-center justify-between px-8 py-4">
    <div>
      <h3 class="font-montserrat font-medium">Responders</h3>
      <p class="font-dm-sans text-xs font-bold uppercase tracking-wide text-slate-400">
        The date goes here
      </p>
    </div>
    <button class="rounded-lg border-[1px] border-slate-400 p-0.5" on:click={closeMobileDrawer}>
      <MdiClose class="text-lg text-slate-400" />
    </button>
  </div>
  <div class="grid grid-cols-2">
    <div>
      <div class="border-b-[1px] border-gray-300 px-8">
        <div class="mr-1 inline-block h-2 w-2 rounded-full bg-success" />
        <span class="font-dm-sans text-xs font-bold uppercase tracking-wide text-slate-400">
          AVAILABLE
        </span>
      </div>
      <ul class="space-y-2 py-2 pl-8">
        {#each availableMembersOfSelection as availableName}
          <li class="text-lg text-gray-800">{availableName}</li>
        {/each}
      </ul>
    </div>
    <div>
      <div class="border-b-[1px] border-gray-300 px-8">
        <div class="mr-1 inline-block h-2 w-2 rounded-full bg-gray-400" />
        <span class="font-dm-sans text-xs font-bold uppercase tracking-wide text-slate-400">
          NOT AVAILABLE
        </span>
      </div>
      <ul class="space-y-2 py-2 pl-8">
        {#each notAvailableMembersOfSelection as notAvailableName}
          <li class="text-lg text-gray-400">{notAvailableName}</li>
        {/each}
      </ul>
    </div>
  </div>
</div>
