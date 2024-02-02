<script lang="ts">
  import { onMount } from "svelte";

  import { DEFAULT_MEETING_NAME, meetingName } from "$lib/stores/meetingSetupStores";

  /* Reset to the default meeting name*/
  onMount(() => {
    $meetingName = DEFAULT_MEETING_NAME;
  });

  const onFocus = (e: Event) => {
    (e.target as HTMLInputElement).select();
  };
  const onSelect = (e: Event) => {
    (e.target as HTMLInputElement).select();
  };
</script>

<div id="meeting-name-input-container" class="mx-auto mb-3 h-12 w-80">
  <input
    type="text"
    alt="meeting name input"
    id="meeting-name-input"
    class="input h-full w-full rounded-lg text-center text-2xl text-zinc-500"
    on:focus={onFocus}
    on:select={onSelect}
    bind:value={$meetingName}
  />
</div>
