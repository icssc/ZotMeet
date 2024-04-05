<script lang="ts">
  import { onMount } from "svelte";

  import { DEFAULT_MEETING_NAME, meetingName } from "$lib/stores/meetingSetupStores";

  let inputRef: HTMLInputElement;

  /* Reset to the default meeting name*/
  onMount(() => {
    $meetingName = DEFAULT_MEETING_NAME;
    inputRef.focus();
  });
</script>

<div class="flex flex-row items-center gap-x-4 text-lg text-gray-500">
  <input
    type="text"
    class="flex-center w-full appearance-none rounded-none border-x-0 border-t-0 border-gray-base p-1 text-2xl font-light placeholder:text-gray-base focus:outline-none focus:ring-0 md:text-3xl"
    placeholder="Meeting Name"
    bind:value={$meetingName}
    bind:this={inputRef}
  />
</div>
