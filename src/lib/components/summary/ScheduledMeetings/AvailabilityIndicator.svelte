<script lang="ts">
  import type { ScheduledMeeting } from "$lib/types/meetings";

  export let meeting: ScheduledMeeting;
</script>

<div class="dropdown h-fit">
  <button
    tabindex="0"
    class="btn m-0 my-1 flex h-fit min-h-0 flex-nowrap rounded-md border-gray-300 bg-gray-100 py-2 shadow-none outline-none hover:bg-gray-200"
  >
    <div
      class:bg-success={meeting.attendance === "accepted"}
      class:bg-error={meeting.attendance === "declined"}
      class:bg-warning={meeting.attendance === "maybe"}
      class:bg-slate-400={!meeting.attendance}
      class="h-2 w-2 rounded-full"
    />
    <span class="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-slate-400">
      {#if meeting.attendance}
        {meeting.attendance}
      {:else}
        Not Stated
      {/if}
    </span>
  </button>
  <ul
    class="menu dropdown-content z-[1] rounded-md border-[1px] border-gray-300 bg-slate-200 p-1 lg:right-0"
  >
    <li>
      <button
        class="rounded-[4px] pl-3 pr-10 hover:bg-slate-300"
        class:bg-slate-100={meeting.attendance === "accepted"}
      >
        <div class="h-2 w-2 rounded-full bg-success" />
        <span class="text-xs font-semibold text-slate-400">ACCEPT</span></button
      >
    </li>
    <li>
      <button
        class="rounded-[4px] pl-3 pr-10"
        class:bg-slate-100={meeting.attendance === "declined"}
      >
        <div class="h-2 w-2 rounded-full bg-error" />
        <span class="text-xs font-semibold text-slate-400">DECLINE</span></button
      >
    </li>
    <li>
      <button class="rounded-[4px] pl-3 pr-10" class:bg-slate-100={meeting.attendance === "maybe"}>
        <div class="h-2 w-2 rounded-full bg-warning" />
        <span class="text-xs font-semibold text-slate-400">MAYBE</span></button
      >
    </li>
  </ul>
</div>
