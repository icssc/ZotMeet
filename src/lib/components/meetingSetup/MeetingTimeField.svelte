<script lang="ts">
  import { onMount } from "svelte";

  import { DEFAULT_MEETING_TIMES, startTime, endTime } from "$lib/stores/meetingSetupStores";

  /* Reset to the default meeting name*/
  onMount(() => {
    $startTime = DEFAULT_MEETING_TIMES.startTime;
    $endTime = DEFAULT_MEETING_TIMES.endTime;
  });
</script>

<!--TODO: make custom step -->
<div id="meeting-time-input-container" class="mx-auto mb-3 flex h-12 w-10/12 justify-around gap-10">
  <input
    type="time"
    alt="meeting start time input"
    id="meeting-start-time-input"
    class="input h-full w-full rounded-lg text-center text-2xl text-zinc-500"
    step="900"
    bind:value={$startTime}
  />
  <input
    type="time"
    alt="meeting end time input"
    id="meeting-end-time-input"
    class="input h-full w-full rounded-lg text-center text-2xl text-zinc-500"
    step="900"
    bind:value={$endTime}
  />
</div>
