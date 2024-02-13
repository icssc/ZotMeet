<script lang="ts">
  import { onMount } from "svelte";
  import SveltyPicker from "svelty-picker";

  import { BLOCK_LENGTH } from "$lib/stores/availabilityStores";
  import { DEFAULT_MEETING_TIMES, startTime, endTime } from "$lib/stores/meetingSetupStores";
  import ClockIcon from "~icons/material-symbols/nest-clock-farsight-analog-outline";

  /* Reset to the default meeting name*/
  onMount(() => {
    $startTime = DEFAULT_MEETING_TIMES.startTime;
    $endTime = DEFAULT_MEETING_TIMES.endTime;
  });
</script>

<div>
  <div class="flex flex-row gap-x-1 pb-1 text-slate-medium">
    <ClockIcon />
    <p class="text-sm font-bold uppercase">Meet no earlier / No later than</p>
  </div>

  <!--TODO: make custom step -->
  <div
    id="meeting-time-input-container"
    class="flex flex-row items-center gap-x-4 text-sm text-gray-500"
  >
    <SveltyPicker
      inputId="meeting-start-time-input"
      inputClasses="w-24 flex-center p-1 appearance-none placeholder:text-gray-base border-t-0 border-x-0 rounded-none border-gray-base focus:outline-none focus:ring-0"
      mode="time"
      format="hh:ii"
      displayFormat="HH:ii P"
      minuteIncrement={BLOCK_LENGTH}
      manualInput={true}
      autocommit={true}
      bind:value={$startTime}
    />
    and
    <SveltyPicker
      inputId="meeting-end-time-input"
      inputClasses="w-24 flex-center p-1 appearance-none placeholder:text-gray-base border-t-0 border-x-0 rounded-none border-gray-base focus:outline-none focus:ring-0"
      mode="time"
      format="hh:ii"
      displayFormat="HH:ii P"
      manualInput={true}
      minuteIncrement={BLOCK_LENGTH}
      bind:value={$endTime}
      autocommit={true}
    />
    PST
  </div>
</div>
