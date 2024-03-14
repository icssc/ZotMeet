<script lang="ts">
  import { availabilityDates } from "$lib/stores/availabilityStores";
  import { ZotDate } from "$lib/utils/ZotDate";
  import { cn } from "$lib/utils/utils";
  import MdiClose from "~icons/mdi/close";

  export let isMobileDrawerOpen: boolean;
  export let selectedZotDateIndex: number | null;
  export let selectedBlockIndex: number | null;
  export let availableMembersOfSelection: string[];
  export let notAvailableMembersOfSelection: string[];
  export let closeMobileDrawer: () => void;

  let blockInfoString: string;

  $: {
    if (selectedZotDateIndex !== null && selectedBlockIndex !== null) {
      const formattedDate = $availabilityDates[selectedZotDateIndex].day.toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
        },
      );

      const earliestTime = $availabilityDates[selectedZotDateIndex].earliestTime;
      const blockLength = $availabilityDates[selectedZotDateIndex].blockLength;
      const startTime = ZotDate.toTimeBlockString(
        earliestTime + selectedBlockIndex * blockLength,
        false,
      );
      const endTime = ZotDate.toTimeBlockString(
        earliestTime + selectedBlockIndex * blockLength + blockLength,
        false,
      );

      blockInfoString = `${formattedDate}, ${startTime} - ${endTime}`;
    } else {
      blockInfoString = "Select a cell to view";
    }
  }
</script>

<div>
  <div class="hidden pb-1 pl-8 lg:block">
    <h3 class="font-montserrat text-xl font-medium">Responders</h3>
    <p class="font-dm-sans text-xs font-bold uppercase tracking-wide text-slate-400">
      {blockInfoString}
    </p>
  </div>
  <div
    class={cn(
      "fixed bottom-0 left-0 h-96 w-full translate-y-full overflow-auto rounded-t-xl border-[1px] border-gray-400 bg-gray-100 bg-opacity-90 transition-transform duration-500 ease-in-out sm:left-auto sm:right-0 sm:w-96 lg:relative lg:right-0 lg:top-0 lg:h-auto lg:w-72 lg:translate-y-0 lg:self-stretch lg:rounded-l-xl lg:rounded-r-none lg:bg-opacity-50",
      isMobileDrawerOpen && "translate-y-0",
    )}
  >
    <div class="flex items-center justify-between px-8 py-4 lg:hidden">
      <div>
        <h3 class="font-montserrat font-medium">Responders</h3>
        <p class="font-dm-sans text-xs font-bold uppercase tracking-wide text-slate-400">
          {blockInfoString}
        </p>
      </div>
      <button
        class="rounded-lg border-[1px] border-slate-400 p-0.5 lg:hidden"
        on:click={closeMobileDrawer}
      >
        <MdiClose class="text-lg text-slate-400" />
      </button>
    </div>
    <div class="grid grid-cols-2 lg:flex lg:flex-col lg:gap-10 lg:py-4">
      <div>
        <div class="border-b-[1px] border-gray-300 px-8">
          <div class="mr-1 inline-block h-2 w-2 rounded-full bg-success" />
          <span class="font-dm-sans text-xs font-bold uppercase tracking-wide text-slate-400">
            AVAILABLE
          </span>
        </div>
        <ul class="h-64 space-y-2 overflow-auto py-2 pl-8">
          {#each availableMembersOfSelection as availableName}
            <li class="text-lg text-gray-800">{availableName}</li>
          {:else}
            <li class="text-gray-400 italic text-sm">N/A</li>
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
        <ul class="h-64 space-y-2 overflow-auto py-2 pl-8">
          {#each notAvailableMembersOfSelection as notAvailableName}
            <li class="text-lg text-gray-400">{notAvailableName}</li>
          {:else}
            <li class="text-gray-400 italic text-sm">N/A</li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</div>
