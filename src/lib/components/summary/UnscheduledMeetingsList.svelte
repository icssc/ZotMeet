<script lang="ts">
  import { unscheduledMeetings } from "$lib/stores/summaryStores";
  import type { UnscheduledMeeting } from "$lib/types/meetings";
  import {
    convertIsoToDate,
    convertTo12HourFormat,
    filterMeetingsByGroupID,
    sortUnscheduledMeetingsByDateAndTime,
  } from "$lib/utils/summary-helpers";
  import CalendarIcon from "~icons/material-symbols/calendar-month";
  import LocationIcon from "~icons/material-symbols/location-on";
  import ClockIcon from "~icons/material-symbols/nest-clock-farsight-analog-outline";

  export let groupID: number | undefined;
  const filtered = groupID
    ? filterMeetingsByGroupID($unscheduledMeetings, groupID)
    : $unscheduledMeetings;
  const sortedMeetings = sortUnscheduledMeetingsByDateAndTime(filtered as UnscheduledMeeting[]);
</script>

<div class="flex flex-col gap-2">
  {#each sortedMeetings as meeting}
    <div
      class="card flex h-fit flex-col justify-between gap-4 rounded-lg bg-cover bg-center p-3 hover:variant-ghost md:flex-row md:items-center"
    >
      <div class="flex w-full flex-wrap items-center justify-between gap-2">
        <div class="flex flex-col gap-y-1">
          <a href={meeting.link} target="_blank" referrerpolicy="no-referrer">
            <p class="line-clamp-1 max-h-12 text-xl font-bold md:text-2xl">
              {meeting.name}
            </p>
          </a>

          <div class="flex flex-row flex-wrap gap-x-4">
            <p class="text-md flex items-center gap-1 md:text-lg">
              <CalendarIcon />
              {convertIsoToDate(meeting.startDate)} - {convertIsoToDate(meeting.endDate)}
            </p>
            <p class="text-md flex items-center gap-1 md:text-lg">
              <ClockIcon />
              {convertTo12HourFormat(meeting.startTime)} - {convertTo12HourFormat(meeting.endTime)}
            </p>
            <p class="text-md flex items-center gap-1 md:text-lg">
              <LocationIcon />
              {meeting.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
