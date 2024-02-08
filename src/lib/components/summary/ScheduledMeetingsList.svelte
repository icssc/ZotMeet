<script lang="ts">
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";

  import { scheduledMeetings } from "$lib/stores/summaryStores";
  import type { ScheduledMeeting } from "$lib/types/meetings";
  import {
    convertIsoToWeekdayDate,
    convertTo12HourFormat,
    filterMeetingsByGroupID,
    groupAndSortScheduledMeetings,
  } from "$lib/utils/summary-helpers";
  import LocationIcon from "~icons/material-symbols/location-on";
  import ClockIcon from "~icons/material-symbols/nest-clock-farsight-analog-outline";

  export let groupID: number | undefined;

  const filtered = groupID
    ? filterMeetingsByGroupID($scheduledMeetings, groupID)
    : $scheduledMeetings;
  const sortedMeetings = groupAndSortScheduledMeetings(filtered as ScheduledMeeting[]);
</script>

{#each Object.keys(sortedMeetings) as date}
  <div class="card variant-glass p-2">
    <h2 class="mb-2 text-xl font-bold md:text-2xl">{convertIsoToWeekdayDate(date)}</h2>

    <div class="flex flex-col gap-2">
      {#each sortedMeetings[date] as meeting}
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
                  <ClockIcon />
                  {convertTo12HourFormat(meeting.startTime)} - {convertTo12HourFormat(
                    meeting.endTime,
                  )}
                </p>
                <p class="text-md flex items-center gap-1 md:text-lg">
                  <LocationIcon />
                  {meeting.location}
                </p>
              </div>
            </div>
          </div>

          <div class="flex w-full justify-center md:w-fit">
            <RadioGroup
              class="flex h-fit w-fit items-center"
              active="variant-filled-primary"
              hover="hover:variant-soft-primary"
            >
              <RadioItem bind:group={meeting.attending} name="justify" value={"Yes"} required
                >Yes</RadioItem
              >
              <RadioItem bind:group={meeting.attending} name="justify" value={"No"} required
                >No</RadioItem
              >
              <RadioItem bind:group={meeting.attending} name="justify" value={"Maybe"} required
                >Maybe</RadioItem
              >
            </RadioGroup>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/each}
