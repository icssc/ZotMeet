<script lang="ts">
  import { startTime, endTime } from "$lib/stores/meetingSetupStores";
  import ClockIcon from "~icons/material-symbols/nest-clock-farsight-analog-outline";

  let startHour: number = 9;
  let endHour: number = 4;
  let startPeriod: "AM" | "PM" = "AM";
  let endPeriod: "AM" | "PM" = "PM";

  function convertTo24Hour(hour: number, period: "AM" | "PM"): string {
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    return hour.toString().padStart(2, "0");
  }

  $: $startTime = `${convertTo24Hour(startHour, startPeriod)}:00` as `${string}:${string}`;
  $: $endTime = `${convertTo24Hour(endHour, endPeriod)}:00` as `${string}:${string}`;
</script>

<div>
  <div class="flex flex-row items-center gap-x-1 pb-2 text-slate-medium">
    <ClockIcon />
    <p class="text-sm font-semibold uppercase tracking-wide">ANY TIME BETWEEN (PST)</p>
  </div>

  <div
    id="meeting-time-input-container"
    class="flex flex-col flex-wrap gap-x-2 space-y-2 pt-2 text-sm text-gray-500 xs:flex-row xs:items-center xs:space-y-0 xs:pt-0 md:gap-x-4"
  >
    <div class="flex gap-[6px]">
      <select bind:value={startHour} class="select select-bordered h-8 min-h-0 py-0 pl-3 pr-8">
        {#each Array.from({ length: 12 }, (_, i) => i + 1) as hour}
          <option value={hour} selected={startHour === hour}>{hour}</option>
        {/each}
      </select>
      <select bind:value={startPeriod} class="select select-bordered h-8 min-h-0 py-0 pl-3 pr-8">
        <option selected={startPeriod === "AM"}>AM</option>
        <option selected={startPeriod === "PM"}>PM</option>
      </select>
    </div>

    <span class="pl-2 xs:pl-0"> and </span>

    <div class="flex gap-[6px]">
      <select bind:value={endHour} class="select select-bordered h-8 min-h-0 py-0 pl-3 pr-8">
        {#each Array.from({ length: 12 }, (_, i) => i + 1) as hour}
          <option value={hour} selected={endHour === hour}>{hour}</option>
        {/each}
      </select>
      <select bind:value={endPeriod} class="select select-bordered h-8 min-h-0 py-0 pl-3 pr-8">
        <option selected={endPeriod === "AM"}>AM</option>
        <option selected={endPeriod === "PM"}>PM</option>
      </select>
    </div>
  </div>
</div>
