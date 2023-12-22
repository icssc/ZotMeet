<script lang="ts">
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";

  import { scheduledMeetings } from "$lib/stores/summaryStores";
  import {
    convertIsoToWeekdayDate,
    convertTo12HourFormat,
    groupAndSortScheduledMeetings,
  } from "$lib/utils/summary-helpers";
  import LocationIcon from "~icons/material-symbols/location-on";
  import ClockIcon from "~icons/material-symbols/nest-clock-farsight-analog-outline";

  const sortedMeetings = groupAndSortScheduledMeetings($scheduledMeetings);
</script>

{#each Object.keys(sortedMeetings) as date}
  <div class="p-2 card variant-glass">
    <h2 class="mb-2 text-xl font-bold md:text-2xl">{convertIsoToWeekdayDate(date)}</h2>

    <div class="flex flex-col gap-2">
      {#each sortedMeetings[date] as meeting}
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
                  <ClockIcon />
                  {convertTo12HourFormat(meeting.startTime)} - {convertTo12HourFormat(
                    meeting.endTime,
                  )}
                </p>
                <p class="flex items-center gap-1 text-md md:text-lg">
                  <LocationIcon />
                  {meeting.location}
                </p>
              </div>
            </div>
          </div>

          <RadioGroup
            class="flex items-center h-fit w-fit"
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
      {/each}
    </div>
  </div>
{/each}
