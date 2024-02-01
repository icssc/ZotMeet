<!-- <script lang="ts">
  import { TabGroup, Tab } from "@skeletonlabs/skeleton";

  import GroupList from "$lib/components/summary/GroupsCarousel.svelte";
  import ScheduledMeetingsList from "$lib/components/summary/ScheduledMeetingsList.svelte";
  import UnscheduledMeetingsList from "$lib/components/summary/UnscheduledMeetingsList.svelte";

  let tabSet: number = 0;
</script>

<div class="flex flex-col gap-8 px-4 pt-8 md:px-32">
  <div class="flex flex-col gap-4">
    <h1 class="border-surface-400-500-token border-b text-4xl font-bold">Groups</h1>
    <GroupList />
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
</div> -->

<script lang="ts">
  // import * as Carousel from "$lib/components/ui/carousel/index";
  import GroupsCarousel from "$lib/components/summary/GroupsCarousel.svelte";
  import ScheduledMeetingsList from "$lib/components/summary/ScheduledMeetingsList.svelte";
  import * as Tabs from "$lib/components/ui/tabs";

  // import UnscheduledMeetingsList from "$lib/components/summary/UnscheduledMeetingsList.svelte";
</script>

<div class="flex flex-col gap-8 px-4 pt-8 md:px-32">
  <h1 class="text-4xl font-bold">Groups</h1>

  <GroupsCarousel />

  <!-- <Carousel.Root>
    <Carousel.Content>
      <Carousel.Item>Dog 1</Carousel.Item>
      <Carousel.Item>Dog 2</Carousel.Item>
      <Carousel.Item>Dog 3</Carousel.Item>
    </Carousel.Content>
    <Carousel.Previous />
    <Carousel.Next />
  </Carousel.Root> -->

  <h1 class="text-4xl font-bold">Meetings</h1>

  <div class="flex-center">
    <Tabs.Root value="scheduled" class="flex-center w-full flex-col">
      <Tabs.List>
        <Tabs.Trigger value="scheduled">Scheduled</Tabs.Trigger>
        <Tabs.Trigger value="unscheduled">Unscheduled</Tabs.Trigger>
      </Tabs.List>

      <div class="flex w-full flex-1 justify-start">
        <Tabs.Content value="scheduled" class="w-full">
          <ScheduledMeetingsList />
        </Tabs.Content>
        <Tabs.Content value="unscheduled">Change your password here.</Tabs.Content>
      </div>
    </Tabs.Root>
  </div>
</div>
