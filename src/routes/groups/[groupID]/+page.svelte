<script lang="ts">
  import { TabGroup, Tab } from "@skeletonlabs/skeleton";

  import MembersList from "$lib/components/groups/MembersCarousel.svelte";
  import ScheduledMeetingsList from "$lib/components/summary/ScheduledMeetingsList.svelte";
  import UnscheduledMeetingsList from "$lib/components/summary/UnscheduledMeetingsList.svelte";
  import { groups } from "$lib/stores/summaryStores";

  export let data;
  const groupID = data.groupID;
  const group = $groups.find((g) => g.id === groupID)!;

  let tabSet: number = 0;
</script>

<div class="flex flex-col gap-8 px-4 pt-6 md:px-32">
  <div
    class="grid-rows-[100px_minmax(0, 1fr)] grid grid-cols-[120px_minmax(0,1fr)] content-start md:grid-cols-2 md:gap-4"
  >
    <img
      src={group.img}
      alt="A cute dog"
      class="row-start-1 row-end-2 h-24 w-24 object-cover object-center md:row-start-2 md:row-end-3 md:h-40 md:w-40 lg:h-64 lg:w-64"
    />
    <h1
      class="self-center overflow-visible text-3xl font-bold sm:col-start-2 sm:col-end-3 md:col-span-2 md:text-5xl lg:text-6xl"
    >
      {group.name}
    </h1>
  </div>

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
          <div class="flex flex-col gap-4"><ScheduledMeetingsList {groupID} /></div>
        {:else if tabSet === 1}
          <div class="flex flex-col gap-2">
            <UnscheduledMeetingsList {groupID} />
          </div>
        {/if}
      </svelte:fragment>
    </TabGroup>
  </div>
</div>
