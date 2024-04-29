<script lang="ts">
  // import GroupCarousel from "$lib/components/summary/GroupsCarousel.svelte";
  // import type { PageData } from './$types';

  import ScheduledMeetingsList from "$lib/components/summary/ScheduledMeetings/ScheduledMeetingsList.svelte";
  import UnscheduledMeetingsList from "$lib/components/summary/UnscheduledMeetings/UnscheduledMeetingsList.svelte";

  // export let data: PageData;
  let currentTab: number = 0;
</script>

<!-- <div class="flex flex-col gap-2 px-4 lg:px-16">
    <h2 class="font-montserrat text-xl font-semibold text-gray-800 lg:text-3xl">Groups</h2>
    <GroupCarousel />
  </div> -->
<div
  class="mt-4 flex flex-col gap-4 rounded-xl border-[1px] border-gray-300 bg-gradient-to-tr from-[rgba(55,124,251,0.05)] to-[rgba(246,128,103,0.05)] p-2 pt-4 lg:px-14"
>
  <div class="flex w-full flex-col gap-2 pl-2">
    <h2 class="font-montserrat text-xl font-semibold text-gray-800 lg:text-3xl">Meetings</h2>
    <div class="flex lg:justify-start">
      <div role="tablist" class="tabs tabs-bordered w-full lg:max-w-sm">
        <button
          role="tab"
          class="tab font-montserrat font-medium text-gray-400 lg:text-lg"
          class:tab-active={currentTab === 0}
          class:text-gray-800={currentTab === 0}
          style:border-color={currentTab === 0 ? "oklch(var(--a))" : undefined}
          on:click={() => {
            currentTab = 0;
          }}>Scheduled</button
        >
        <button
          role="tab"
          class="tab font-montserrat font-medium text-gray-400 lg:text-lg"
          class:tab-active={currentTab === 1}
          class:text-gray-800={currentTab === 1}
          style:border-color={currentTab === 1 ? "oklch(var(--a))" : undefined}
          on:click={() => {
            currentTab = 1;
          }}>Unscheduled</button
        >
      </div>
      <div class="hidden w-full border-b-2 border-gray-300 lg:block" />
    </div>
  </div>

  <div>
    {#if currentTab === 0}
      <ScheduledMeetingsList />
    {:else if currentTab === 1}
      <UnscheduledMeetingsList />
    {/if}
  </div>
</div>
