<script lang="ts">
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";

  import { convertIsoToWeekdayDate, convertTo12HourFormat } from "$lib/helpers";
  import { scheduledMeetings } from "$lib/stores/summaryStores";
  import type { ScheduledMeeting } from "$lib/types/meetings";
  import LocationIcon from "~icons/material-symbols/location-on";
  import ClockIcon from "~icons/material-symbols/nest-clock-farsight-analog-outline";

  // Group meetings by startDate
  let groupedMeetingsByDate: Record<string, ScheduledMeeting[]> = {};
  $scheduledMeetings.forEach((meeting) => {
    const date = meeting.date;
    if (!groupedMeetingsByDate[date]) {
      groupedMeetingsByDate[date] = [];
    }
    groupedMeetingsByDate[date].push(meeting);
  });
</script>

{#each Object.keys(groupedMeetingsByDate) as date}
  <div class="p-2 card variant-glass">
    <h2 class="mb-2 text-xl font-bold md:text-2xl">{convertIsoToWeekdayDate(date)}</h2>

    <div class="flex flex-col gap-2">
      {#each groupedMeetingsByDate[date] as meeting}
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
