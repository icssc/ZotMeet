<script lang="ts">
  import { unscheduledMeetings } from "$lib/stores/summaryStores";
  import {
    convertIsoToDate,
    convertTo12HourFormat,
    sortUnscheduledMeetingsByDateAndTime,
  } from "$lib/utils/summary-helpers";
  import MaterialSymbolsGroupsOutline from "~icons/material-symbols/groups-outline";
  import MdiCalendarBlankOutline from "~icons/mdi/calendar-blank-outline";
  import MdiClockOutline from "~icons/mdi/clock-outline";
  import MdiLocationOutline from "~icons/mdi/location-outline";

  const sortedMeetings = sortUnscheduledMeetingsByDateAndTime($unscheduledMeetings);
</script>

<div class="flex flex-col gap-4 p-4">
  {#each sortedMeetings as meeting (meeting.id)}
    <div
      class="flex items-center gap-4 rounded-lg border-[1px] border-gray-300 bg-gray-50 bg-opacity-50 p-4 lg:max-w-7xl lg:p-6"
      class:not-indicated={!meeting.hasIndicated}
    >
      <div
        class="mx-2 rounded-full border-[1px] border-gray-300 bg-slate-100 p-3 text-xl text-gray-500"
      >
        <MaterialSymbolsGroupsOutline />
      </div>
      <div class="flex flex-grow flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-2">
        <div class="w-full">
          <a href={meeting.link} target="_blank" referrerpolicy="no-referrer" class="block w-fit">
            <p class="line-clamp-1 py-1 text-lg font-semibold lg:mb-0.5 lg:p-0 lg:text-xl">
              {meeting.name}
            </p>
          </a>
          <div class="flex flex-col gap-0.5 text-slate-400 lg:flex-row lg:gap-4">
            <p class="flex items-center gap-1 text-xs font-semibold">
              <MdiCalendarBlankOutline />
              {convertIsoToDate(meeting.startDate)} - {convertIsoToDate(meeting.endDate)}
            </p>
            <p class="flex items-center gap-1 text-xs font-semibold">
              <MdiClockOutline />
              {convertTo12HourFormat(meeting.startTime)} - {convertTo12HourFormat(meeting.endTime)}
            </p>
            <p class="flex items-center gap-1 text-xs font-semibold">
              <MdiLocationOutline />
              {meeting.location}
            </p>
          </div>
        </div>
        <!-- <div class="flex items-center gap-2 p-1">
          <div
            class:bg-success={meeting.hasIndicated}
            class:bg-slate-400={!meeting.hasIndicated}
            class="h-2 w-2 rounded-full"
          />
          <span
            class="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            {#if meeting.hasIndicated}
              INDICATED
            {:else}
              NOT INDICATED
            {/if}
          </span>
        </div> -->
      </div>
    </div>
  {/each}
</div>

<style lang="postcss">
  .not-indicated {
    @apply border-2 border-dashed border-primary border-opacity-30;
  }
</style>
