<script lang="ts">
  import { LightSwitch, RadioItem, RadioGroup, TabGroup, Tab } from "@skeletonlabs/skeleton";

  import GroupList from "$lib/components/summary/GroupList.svelte";
  import LocationIcon from "~icons/material-symbols/location-on";
  import ClockIcon from "~icons/material-symbols/nest-clock-farsight-analog-outline";

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

  let scheduledMeetings = [
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

  // Sort meetings by startDate
  scheduledMeetings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Group meetings by startDate
  let groupedMeetingsByDate: Record<string, ScheduledMeeting[]> = {};
  scheduledMeetings.forEach((meeting) => {
    const date = meeting.date;
    if (!groupedMeetingsByDate[date]) {
      groupedMeetingsByDate[date] = [];
    }
    groupedMeetingsByDate[date].push(meeting);
  });

  function convertIsoToDate(isoDateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };

    const date = new Date(isoDateString);
    return date.toLocaleDateString("en-US", options);
  }

  function convertTo12HourFormat(time: string): string {
    const [hours, minutes] = time.split(":");
    let period = "am";

    let hours12 = parseInt(hours, 10);

    if (hours12 >= 12) {
      period = "pm";
      if (hours12 > 12) {
        hours12 -= 12;
      }
    }

    return `${hours12}:${minutes} ${period}`;
  }
</script>

<LightSwitch />

<div class="flex flex-col gap-8 px-4 pt-8 md:px-32">
  <GroupList {groups} />

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
          <div class="flex flex-col gap-4">
            {#each Object.keys(groupedMeetingsByDate) as date}
              <div class="p-2 card variant-ringed">
                <h2 class="mb-2 text-xl font-bold md:text-2xl">{convertIsoToDate(date)}</h2>

                <div class="flex flex-col gap-2">
                  {#each groupedMeetingsByDate[date] as meeting}
                    <a href={meeting.link} target="_blank" referrerpolicy="no-referrer">
                      <div
                        class="flex flex-col justify-between gap-4 p-3 bg-center bg-cover rounded-lg md:items-center h-fit md:flex-row card variant-ghost"
                      >
                        <div class="flex flex-wrap items-center justify-between w-full gap-2">
                          <div class="flex flex-col">
                            <p class="text-xl font-bold md:text-2xl line-clamp-1 max-h-12">
                              {meeting.name}
                            </p>

                            <div class="flex flex-row flex-wrap gap-x-4">
                              <p class="flex items-center gap-1 text-md md:text-lg">
                                <ClockIcon />
                                {convertTo12HourFormat(meeting.startTime)} - {convertTo12HourFormat(
                                  meeting.endTime,
                                )}
                              </p>
                              <p class="flex items-center gap-1 text-md md:text-lg">
                                <LocationIcon />
                                {meeting.location}
                              </p>
                            </div>
                          </div>
                        </div>

                        <RadioGroup
                          class="flex items-center h-fit w-fit"
                          active="variant-filled-primary"
                          hover="hover:variant-soft-primary"
                        >
                          <RadioItem
                            bind:group={meeting.attending}
                            name="justify"
                            value={"Yes"}
                            required>Yes</RadioItem
                          >
                          <RadioItem
                            bind:group={meeting.attending}
                            name="justify"
                            value={"No"}
                            required>No</RadioItem
                          >
                          <RadioItem
                            bind:group={meeting.attending}
                            name="justify"
                            value={"Maybe"}
                            required>Maybe</RadioItem
                          >
                        </RadioGroup>
                      </div>
                    </a>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        {:else if tabSet === 1}
          (tab panel 2 contents)
        {/if}
      </svelte:fragment>
    </TabGroup>
  </div>
</div>
