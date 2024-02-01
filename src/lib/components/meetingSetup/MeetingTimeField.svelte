<script lang="ts">
  import { onMount } from "svelte";
  // import {BLOCK_LENGTH} from "$lib/stores/availabilityStores";
  import SveltyPicker from "svelty-picker";

  import { BLOCK_LENGTH } from "$lib/stores/availabilityStores";
  import { DEFAULT_MEETING_TIMES, startTime, endTime } from "$lib/stores/meetingSetupStores";

  /* Reset to the default meeting name*/
  onMount(() => {
    $startTime = DEFAULT_MEETING_TIMES.startTime;
    $endTime = DEFAULT_MEETING_TIMES.endTime;
  });
</script>

<!--TODO: make custom step -->
<div id="meeting-time-input-container" class="mx-auto mb-3 flex h-12 w-10/12 justify-around gap-5">
  <SveltyPicker
    inputId="meeting-start-time-input"
    inputClasses="h-full w-full rounded-lg text-2xl text-zinc-500"
    mode="time"
    format="hh:ii"
    displayFormat="HH:ii P"
    minuteIncrement={BLOCK_LENGTH}
    manualInput={true}
    autocommit={true}
    bind:value={$startTime}
  />
  <SveltyPicker
    inputId="meeting-end-time-input"
    inputClasses="h-full w-full rounded-lg text-2xl text-zinc-500"
    mode="time"
    format="hh:ii"
    displayFormat="HH:ii P"
    manualInput={true}
    minuteIncrement={BLOCK_LENGTH}
    bind:value={$endTime}
    autocommit={true}
  />
  <!--  <input-->
  <!--    type="time"-->
  <!--    alt="meeting start time input"-->
  <!--    id="meeting-start-time-input"-->
  <!--    class="input h-full w-full rounded-lg text-center text-2xl text-zinc-500"-->
  <!--    step={BLOCK_LENGTH * 60}-->
  <!--    pattern="[0-9]{2}:[0-9]{2}"-->
  <!--    bind:value={$startTime}-->
  <!--  />-->

  <!--  <input-->
  <!--    type="time"-->
  <!--    alt="meeting end time input"-->
  <!--    id="meeting-end-time-input"-->
  <!--    class="input h-full w-full rounded-lg text-center text-2xl text-zinc-500"-->
  <!--    pattern="[0-9]{2}:[0-9]{2}"-->
  <!--    step={BLOCK_LENGTH * 60}-->
  <!--    bind:value={$endTime}-->
  <!--  />-->
</div>
