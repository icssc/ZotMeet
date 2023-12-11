<script lang="ts">
  import { LightSwitch } from "@skeletonlabs/skeleton";

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

  let meetings = [
    {
      name: "AntAlmanac",
      id: 1,
      link: "https://google.com",
      scheduled: true,
      startDate: "2023-12-08",
      endDate: "2023-12-08",
      startTime: "11:00",
      endTime: "13:30",
    },
    {
      name: "Meeting Two",
      id: 2,
      link: "https://google.com",
      scheduled: false,
      startDate: "2023-12-08",
      endDate: "2023-12-09",
      startTime: "8:00",
      endTime: "15:00",
    },
    // {
    //   name: "Meeting Three",
    //   id: 3,
    //   link: "https://google.com",
    //   date: "2023-12-08",
    // },
    // {
    //   name: "Meeting Four",
    //   id: 4,
    //   link: "https://google.com",
    //   date: "2023-12-08",
    // },
  ];

  interface Meeting {
    name: string;
    id: number;
    link: string;
    scheduled: boolean;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
  }

  // Sort meetings by startDate
  meetings.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Group meetings by startDate
  let groupedMeetings: Record<string, Meeting[]> = {};
  meetings.forEach((meeting) => {
    const startDate = meeting.startDate;
    if (!groupedMeetings[startDate]) {
      groupedMeetings[startDate] = [];
    }
    groupedMeetings[startDate].push(meeting);
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
    console.log(hours12);

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
  <div class="flex flex-col gap-4">
    <h1 class="text-4xl font-bold">Groups</h1>
    <div class="flex gap-2 overflow-x-auto md:gap-4 snap-x snap-mandatory scroll-smooth">
      {#each groups as group (group.id)}
        <a href={group.link} target="_blank" referrerpolicy="no-referrer">
          <div
            class="flex h-24 p-3 bg-center bg-cover rounded-lg md:h-36 snap-start w-36 md:w-64 card"
            style="background-image: url({group.img})"
          >
            <p class="mt-auto font-semibold text-white line-clamp-2 max-h-12">
              {group.name}
            </p>
          </div>
        </a>
      {/each}
    </div>
  </div>

  <div class="flex flex-col gap-4">
    <h1 class="text-4xl font-bold">Meetings</h1>
    <div class="flex flex-col gap-4">
      <div class="p-2 card variant-ringed">
        {#each Object.keys(groupedMeetings) as date}
          <h2 class="mb-2 text-xl font-bold">{convertIsoToDate(date)}</h2>

          <div class="flex flex-col gap-2">
            {#each groupedMeetings[date] as meeting}
              <a href={meeting.link} target="_blank" referrerpolicy="no-referrer">
                <div
                  class="flex flex-col w-full h-24 p-3 align-middle bg-center bg-cover rounded-lg md:h-36 card variant-soft"
                >
                  <div class="flex flex-col gap-2">
                    <div class="flex flex-col w-fit">
                      <p class="text-xl font-semibold line-clamp-1 max-h-12">
                        {meeting.name}
                      </p>
                      <p class="text-sm">
                        {convertTo12HourFormat(meeting.startTime)} - {convertTo12HourFormat(
                          meeting.endTime,
                        )}
                      </p>
                    </div>
                    {#if meeting.scheduled}
                      <div class="text-sm font-semibold text-green-500">Scheduled ✔</div>
                    {/if}
                  </div>
                  <!-- {#if meeting.scheduled}
                    <div class="text-green-500">Scheduled ✔</div>
                    <div class="flex flex-row gap-2">
                      <p class="text-sm">{convertIsoToDate(meeting.startDate)}</p>
                      <p class="text-sm">{convertTo12HourFormat(meeting.startTime)}</p>
                    </div>
                  {:else}
                    <div class="">
                      <p class="text-sm">
                        {convertIsoToDate(meeting.startDate)} - {convertIsoToDate(meeting.endDate)}
                      </p>
                      <p class="text-sm">
                        {convertTo12HourFormat(meeting.startTime)} - {convertTo12HourFormat(
                          meeting.endTime,
                        )}
                      </p>
                    </div>
                  {/if} -->
                </div>
              </a>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
