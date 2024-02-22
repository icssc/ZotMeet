<script lang="ts">
  import { scheduledMeetings } from "$lib/stores/summaryStores";
  import {
    convertIsoToDate,
    convertTo12HourFormat,
    getWeekdayFromIso,
    groupAndSortScheduledMeetings,
  } from "$lib/utils/summary-helpers";
  import LocationIcon from "~icons/material-symbols/location-on";
  import ClockIcon from "~icons/material-symbols/nest-clock-farsight-analog-outline";

  const sortedMeetings = groupAndSortScheduledMeetings($scheduledMeetings);
</script>

<ul class="timeline timeline-vertical">
  {#each Object.entries(sortedMeetings) as [date, meetings] (date)}
    <li class="[--timeline-col-start:4rem] [--timeline-row-start:auto]">
      <hr class="!row-start-2 !w-0.5 bg-slate-300" />
      <div class="timeline-start !row-start-1 !row-end-3 m-0 pr-2">
        <p class="text-center text-xs font-bold uppercase text-gray-500">
          {getWeekdayFromIso(date)}
        </p>
        <p class="text-center text-gray-400">{convertIsoToDate(date)}</p>
      </div>
      <div class="timeline-middle !row-start-1 !row-end-2 pt-1">
        <div class="h-2 w-2 rounded-full bg-gray-400" />
      </div>
      <div class="timeline-end !row-start-2">
        <div class="card p-2">
          <div class="flex flex-col gap-2">
            {#each meetings as meeting}
              <div
                class="hover:variant-ghost card flex h-fit flex-col justify-between gap-4 rounded-lg bg-cover bg-center p-3 md:flex-row md:items-center"
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
                <div class="flex w-full justify-center md:w-fit">yes no maybe</div>
              </div>
            {/each}
          </div>
        </div>
      </div>
      <hr class="!row-start-3 !w-0.5 bg-slate-300" />
    </li>
  {/each}
</ul>
