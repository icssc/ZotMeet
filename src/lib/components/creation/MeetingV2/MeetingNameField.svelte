<script lang="ts">
  import { onMount } from "svelte";

  import { DEFAULT_MEETING_NAME, meetingName } from "$lib/stores/meetingSetupStores";
  import EditNoteIcon from "~icons/material-symbols/edit-note";

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

<div>
  <div class="flex flex-row items-center gap-x-1 pb-1 text-slate-medium">
    <EditNoteIcon />
    <p class="text-sm font-bold uppercase tracking-wide">Meeting Name</p>
  </div>

  <div class="flex w-[80%] flex-row items-center gap-x-4 text-lg text-gray-500">
    <input
      type="text"
      class="flex-center w-full appearance-none rounded-none border-x-0 border-t-0 border-gray-base p-1 placeholder:text-gray-base focus:outline-none focus:ring-0"
      placeholder="ex: Science Library LAN Party"
      on:focus={onFocus}
      on:select={onSelect}
      bind:value={$meetingName}
    />
  </div>
</div>
