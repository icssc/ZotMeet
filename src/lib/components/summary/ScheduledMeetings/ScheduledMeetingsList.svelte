<script lang="ts">
  import ScheduledMeetingCard from "$lib/components/summary/ScheduledMeetings/ScheduledMeetingCard.svelte";
  import { scheduledMeetings } from "$lib/stores/summaryStores";
  import {
    convertIsoToDate,
    getWeekdayFromIso,
    groupAndSortScheduledMeetings,
  } from "$lib/utils/summary-helpers";

  const sortedMeetings = groupAndSortScheduledMeetings($scheduledMeetings);
</script>

<ul class="timeline timeline-vertical">
  {#each Object.entries(sortedMeetings) as [date, meetings] (date)}
    <li
      class="[--timeline-col-start:4rem] [--timeline-row-start:auto] lg:[--timeline-col-start:5rem]"
    >
      <hr class="!row-start-2 !w-0.5 bg-slate-300" />
      <div class="timeline-start !row-start-1 !row-end-3 m-0 pr-2 pt-1">
        <p class="text-center text-xs font-bold uppercase text-gray-500">
          {getWeekdayFromIso(date)}
        </p>
        <p class="text-center text-gray-400">{convertIsoToDate(date)}</p>
      </div>
      <div class="timeline-middle !row-start-1 !row-end-2">
        <div class="h-2 w-2 rounded-full bg-gray-400" />
      </div>
      <div class="timeline-end !row-start-2 m-0 w-full p-2 pl-3">
        <div class="flex flex-col gap-2">
          {#each meetings as meeting (meeting.id)}
            <ScheduledMeetingCard {meeting} />
          {/each}
        </div>
      </div>
      <hr class="!row-start-3 !w-0.5 bg-slate-300" />
    </li>
  {/each}
</ul>
