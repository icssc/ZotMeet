<script lang="ts">
  import { unscheduledMeetings } from "$lib/stores/summaryStores";
  import {
    convertIsoToDate,
    convertTo12HourFormat,
    sortUnscheduledMeetingsByDateAndTime,
  } from "$lib/utils/summary-helpers";
  import CalendarIcon from "~icons/material-symbols/calendar-month";
  import LocationIcon from "~icons/material-symbols/location-on";
  import ClockIcon from "~icons/material-symbols/nest-clock-farsight-analog-outline";

  const sortedMeetings = sortUnscheduledMeetingsByDateAndTime($unscheduledMeetings);
</script>

<div class="flex flex-col gap-2">
  {#each sortedMeetings as meeting}
    <div
      class="flex flex-col justify-between gap-4 p-3 bg-center bg-cover rounded-lg md:items-center h-fit md:flex-row card hover:variant-ghost"
    >
      <div class="flex flex-wrap items-center justify-between w-full gap-2">
        <div class="flex flex-col gap-y-1">
          <a href={meeting.link} target="_blank" referrerpolicy="no-referrer">
            <p class="text-xl font-bold md:text-2xl line-clamp-1 max-h-12">
              {meeting.name}
            </p>
          </a>

          <div class="flex flex-row flex-wrap gap-x-4">
            <p class="flex items-center gap-1 text-md md:text-lg">
              <CalendarIcon />
              {convertIsoToDate(meeting.startDate)} - {convertIsoToDate(meeting.endDate)}
            </p>
            <p class="flex items-center gap-1 text-md md:text-lg">
              <ClockIcon />
              {convertTo12HourFormat(meeting.startTime)} - {convertTo12HourFormat(meeting.endTime)}
            </p>
            <p class="flex items-center gap-1 text-md md:text-lg">
              <LocationIcon />
              {meeting.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
