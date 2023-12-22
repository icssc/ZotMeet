<script lang="ts">
  import { LightSwitch, TabGroup, Tab } from "@skeletonlabs/skeleton";

  import GroupList from "$lib/components/summary/GroupsCarousel.svelte";
  import ScheduledMeetingsList from "$lib/components/summary/ScheduledMeetingsList.svelte";
  import UnscheduledMeetingsList from "$lib/components/summary/UnscheduledMeetingsList.svelte";

  let tabSet: number = 0;

  let groups = [
    {
      name: "AntAlmanac",
      id: 1,
      img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
      link: "https://google.com",
    },
    {
      name: "Group Two",
      id: 2,
      img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
      link: "https://google.com",
    },
    {
      name: "Group Three",
      id: 3,
      img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
      link: "https://google.com",
    },
    {
      name: "Group Three",
      id: 4,
      img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
      link: "https://google.com",
    },
    {
      name: "Group Three",
      id: 5,
      img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
      link: "https://google.com",
    },
    {
      name: "Group Three",
      id: 6,
      img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
      link: "https://google.com",
    },
  ];

  let scheduledMeetings: ScheduledMeeting[] = [
    {
      name: "AntAlmanac",
      id: 1,
      link: "https://google.com",
      date: "2023-12-08",
      startTime: "11:00",
      endTime: "13:30",
      attending: "Yes",
      location: "CSL 8",
    },
    {
      name: "Meeting Two",
      id: 2,
      link: "https://google.com",
      date: "2023-12-08",
      startTime: "8:00",
      endTime: "15:00",
      attending: "No",
      location: "CSL 8",
    },
    {
      name: "Meeting Three",
      id: 3,
      link: "https://google.com",
      date: "2023-12-09",
      startTime: "8:00",
      endTime: "15:00",
      attending: "Yes",
      location: "CSL 8",
    },
    {
      name: "Meeting Four",
      id: 4,
      link: "https://google.com",
      date: "2023-12-09",
      startTime: "8:00",
      endTime: "15:00",
      attending: "Maybe",
      location: "CSL 8",
    },
  ];

  let unscheduledMeetings: UnscheduledMeeting[] = [
    {
      name: "Unscheduled ZotMeet",
      id: 1,
      link: "https://google.com",
      startDate: "2023-12-08",
      endDate: "2023-12-09",
      startTime: "11:00",
      endTime: "13:30",
      location: "CSL 8",
    },
    {
      name: "Meeting Dos",
      id: 2,
      link: "https://google.com",
      startDate: "2023-12-03",
      endDate: "2023-12-09",
      startTime: "8:00",
      endTime: "15:00",
      location: "CSL 8",
    },
    {
      name: "Meeting Tres",
      id: 3,
      link: "https://google.com",
      startDate: "2023-12-08",
      endDate: "2023-12-09",
      startTime: "8:00",
      endTime: "15:00",
      location: "CSL 8",
    },
    {
      name: "Meeting Quatro",
      id: 4,
      link: "https://google.com",
      startDate: "2023-12-08",
      endDate: "2023-12-19",
      startTime: "8:00",
      endTime: "15:00",
      location: "CSL 8",
    },
  ];

  type ScheduledMeeting = {
    name: string;
    id: number;
    link: string;
    date: string;
    startTime: string;
    endTime: string;
    attending: string;
    location: string;
  };

  type UnscheduledMeeting = {
    name: string;
    id: number;
    link: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    location: string;
  };
</script>

<LightSwitch />

<div class="flex flex-col gap-8 px-4 pt-8 md:px-32">
  <div class="flex flex-col gap-4">
    <h1 class="text-4xl font-bold border-b border-surface-400-500-token">Groups</h1>
    <GroupList {groups} />
  </div>

  <div class="flex flex-col gap-4">
    <TabGroup>
      <div class="flex flex-col w-full gap-x-10 md:flex-row gap-y-2">
        <h1 class="text-4xl font-bold">Meetings</h1>
        <div class="flex justify-center gap-5">
          <Tab bind:group={tabSet} name="scheduledTab" value={0}>Scheduled</Tab>
          <Tab bind:group={tabSet} name="unscheduledTab" value={1}>Unscheduled</Tab>
        </div>
      </div>

      <svelte:fragment slot="panel">
        {#if tabSet === 0}
          <div class="flex flex-col gap-4"><ScheduledMeetingsList {scheduledMeetings} /></div>
        {:else if tabSet === 1}
          <div class="flex flex-col gap-2">
            <UnscheduledMeetingsList {unscheduledMeetings} />
          </div>
        {/if}
      </svelte:fragment>
    </TabGroup>
  </div>
</div>
