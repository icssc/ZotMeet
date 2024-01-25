<script lang="ts">
  import { TimeConstants } from "$lib/types/chrono";
  import { ZotDate } from "$lib/utils/ZotDate";

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

  // SET UP SAMPLE DATES
  const selectedZotDates = [
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
        {#each timeBlocks as timeBlock, blockIndex}
          {@const isTopOfHour = timeBlock % 60 === 0}
          <tr>
            <td class="py-0 pr-1 align-top">
              {#if isTopOfHour}
                <span class="float-right text-xs">
                  {ZotDate.toTimeBlockString(timeBlock)}
                </span>
              {/if}
            </td>
            {#each selectedZotDates as selectedDate}
              {@const isAvailable = selectedDate.getBlockAvailability(blockIndex)}
              <td
                class={`${
                  isTopOfHour && "border-t-neutral-800"
                } border-2 border-b-0 border-neutral-500 px-0 py-0`}
              >
                <button
                  class={`${
                    isAvailable ? "bg-success-400" : "bg-error-400"
                  } block h-full w-full py-2`}
                >
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
