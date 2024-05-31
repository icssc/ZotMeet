<script lang="ts">
  import { onMount } from "svelte";
  // import SveltyPicker from "svelty-picker";

  // import { BLOCK_LENGTH } from "$lib/stores/availabilityStores";
  import { DEFAULT_MEETING_TIMES, startTime, endTime } from "$lib/stores/meetingSetupStores";
  import ClockIcon from "~icons/material-symbols/nest-clock-farsight-analog-outline";

  /* Reset to the default meeting name*/
  onMount(() => {
    $startTime = DEFAULT_MEETING_TIMES.startTime;
    $endTime = DEFAULT_MEETING_TIMES.endTime;
  });
</script>

<div>
  <div class="flex flex-row items-center gap-x-1 pb-2 text-slate-medium">
    <ClockIcon />
    <p class="text-sm font-semibold uppercase tracking-wide">ANY TIME BETWEEN (PST)</p>
  </div>

  <!--TODO: make custom step -->
  <div
    id="meeting-time-input-container"
    class="flex flex-col flex-wrap gap-x-2 space-y-2 pt-2 text-sm text-gray-500 xs:flex-row xs:items-center xs:space-y-0 xs:pt-0 md:gap-x-4"
  >
    <!-- <SveltyPicker
      inputId="meeting-start-time-input"
      inputClasses="w-24 flex-center p-1 appearance-none placeholder:text-gray-base border-t-0 border-x-0 rounded-none border-gray-base focus:outline-none focus:ring-0 text-center"
      mode="time"
      format="hh:ii"
      displayFormat="HH:ii P"
      minuteIncrement={BLOCK_LENGTH}
      manualInput={true}
      autocommit={true}
      bind:value={$startTime}
    />
    <span> and </span>
    <SveltyPicker
      inputId="meeting-end-time-input"
      inputClasses="w-24 flex-center p-1 appearance-none placeholder:text-gray-base border-t-0 border-x-0 rounded-none border-gray-base focus:outline-none focus:ring-0 text-center"
      mode="time"
      format="hh:ii"
      displayFormat="HH:ii P"
      manualInput={true}
      minuteIncrement={BLOCK_LENGTH}
      bind:value={$endTime}
      autocommit={true}
    /> -->

    <div class="flex gap-[6px]">
      <select class="select select-bordered h-8 min-h-0 py-0 pl-3 pr-8">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
        <option>7</option>
        <option>8</option>
        <option selected>9</option>
        <option>10</option>
        <option>11</option>
        <option>12</option>
      </select>
      <select class="select select-bordered h-8 min-h-0 py-0 pl-3 pr-8">
        <option selected>AM</option>
        <option>PM</option>
      </select>
    </div>

    <span class="pl-2 xs:pl-0"> and </span>

    <div class="flex gap-[6px]">
      <select class="select select-bordered h-8 min-h-0 py-0 pl-3 pr-8">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option selected>5</option>
        <option>6</option>
        <option>7</option>
        <option>8</option>
        <option>9</option>
        <option>10</option>
        <option>11</option>
        <option>12</option>
      </select>
      <select class="select select-bordered h-8 min-h-0 py-0 pl-3 pr-8">
        <option>AM</option>
        <option selected>PM</option>
      </select>
    </div>
  </div>
</div>
