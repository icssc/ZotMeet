<script lang="ts">
  import { TabGroup } from "@skeletonlabs/skeleton";

  import GroupCarousel from "$lib/components/summary/GroupsCarousel.svelte";
  import ScheduledMeetingsList from "$lib/components/summary/ScheduledMeetingsList.svelte";
  import UnscheduledMeetingsList from "$lib/components/summary/UnscheduledMeetingsList.svelte";

  let tabSet: number = 0;
</script>

<main
  class="flex w-full flex-col gap-5 overflow-x-clip border-t-[1px] border-gray-300 bg-gray-100 px-2 pt-6 md:rounded-tl-xl"
>
  <div class="flex flex-col gap-2 px-4">
    <h1 class="font-montserrat text-xl font-semibold">Groups</h1>
    <GroupCarousel />
  </div>

  <div class="flex flex-col gap-4">
    <TabGroup>
      <div class="flex w-full flex-col gap-x-10 gap-y-2">
        <h1 class="text-4xl font-bold">Meetings</h1>
        <div class="flex justify-center gap-5">
          <div role="tablist" class="tabs tabs-bordered">
            <button role="tab" class="tab">Tab 1</button>
            <button role="tab" class="tab tab-active">Tab 2</button>
          </div>
        </div>
      </div>

      <svelte:fragment slot="panel">
        {#if tabSet === 0}
          <div class="flex flex-col gap-4"><ScheduledMeetingsList /></div>
        {:else if tabSet === 1}
          <div class="flex flex-col gap-2">
            <UnscheduledMeetingsList />
          </div>
        {/if}
      </svelte:fragment>
    </TabGroup>
  </div>
</main>
