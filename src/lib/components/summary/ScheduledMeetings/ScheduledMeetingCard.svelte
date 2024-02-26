<script lang="ts">
  import AvailabilityIndicator from "$lib/components/summary/ScheduledMeetings/AvailabilityIndicator.svelte";
  import type { ScheduledMeeting } from "$lib/types/meetings";
  import { convertTo12HourFormat } from "$lib/utils/summary-helpers";
  import MaterialSymbolsGroupsOutline from "~icons/material-symbols/groups-outline";
  import MdiClockOutline from "~icons/mdi/clock-outline";
  import MdiLocationOutline from "~icons/mdi/location-outline";

  export let meeting: ScheduledMeeting;
</script>

<div
  class="flex items-center gap-4 rounded-lg border-[1px] border-gray-300 bg-gray-50 bg-opacity-50 p-4 lg:max-w-7xl lg:p-6"
  class:not-indicated={!meeting.attendance}
>
  <div class="rounded-full border-[1px] border-gray-300 bg-slate-100 p-3 text-xl text-gray-500">
    <MaterialSymbolsGroupsOutline />
  </div>
  <div class="flex flex-grow flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-2">
    <div>
      <a href={meeting.link} target="_blank" referrerpolicy="no-referrer">
        <p class="line-clamp-1 text-lg font-semibold lg:mb-0.5 lg:text-xl">
          {meeting.name}
        </p>
      </a>
      <div class="flex flex-col gap-0.5 text-slate-400 lg:flex-row lg:gap-4">
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
    <AvailabilityIndicator {meeting} />
  </div>
</div>

<style>
  .not-indicated {
    @apply border-2 border-dashed border-primary border-opacity-30;
  }
</style>
