<script lang="ts">
  // import {attendees} from "$lib/stores/groupStores";
  // import {ListBoxItem, RadioGroup, RadioItem} from "@skeletonlabs/skeleton";

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

          <!--TODO: Create a way to show all the attending members upon clicking on meeting-->
          <!--              {#each $attendees as user (user.id)}-->
          <!--                  <span class="flex-auto">{user.username}</span>-->
          <!--              {/each}-->
        </div>
      {/each}
    </div>
  </div>
{/each}
