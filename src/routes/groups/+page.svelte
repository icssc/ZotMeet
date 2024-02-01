<script lang="ts">
  import { TabGroup, Tab } from "@skeletonlabs/skeleton";

  import MembersList from "$lib/components/groups/MembersCarousel.svelte";
  import ScheduledMeetingsList from "$lib/components/summary/ScheduledMeetingsList.svelte";
  import UnscheduledMeetingsList from "$lib/components/summary/UnscheduledMeetingsList.svelte";

  let tabSet: number = 0;
</script>

<div class="flex flex-col gap-8 px-4 pt-8 md:px-32">
  <div class="flex flex-col gap-4">
    <h1 class="border-surface-400-500-token border-b text-4xl font-bold">Members</h1>
    <MembersList />
  </div>

  <div class="flex flex-col gap-4">
    <TabGroup>
      <div class="flex w-full flex-col gap-x-10 gap-y-2">
        <h1 class="text-4xl font-bold">Meetings</h1>
        <div class="flex justify-center gap-5">
          <Tab bind:group={tabSet} name="scheduledTab" value={0}>Scheduled</Tab>
          <Tab bind:group={tabSet} name="unscheduledTab" value={1}>Unscheduled</Tab>
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
</div>
