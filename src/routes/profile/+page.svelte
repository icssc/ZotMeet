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
      img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
      link: "https://google.com",
    },
    {
      name: "Meeting Two",
      id: 2,
      img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
      link: "https://google.com",
      scheduled: true,
    },
    {
      name: "Meeting Three",
      id: 3,
      img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
      link: "https://google.com",
    },
    {
      name: "Meeting Four",
      id: 4,
      img: "https://hips.hearstapps.com/goodhousekeeping/assets/17/30/pembroke-welsh-corgi.jpg",
      link: "https://google.com",
    },
  ];
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
      {#each meetings as meeting (meeting.id)}
        <a href={meeting.link} target="_blank" referrerpolicy="no-referrer">
          <div class="flex flex-col w-full h-24 p-3 bg-center bg-cover rounded-lg md:h-36 card">
            <h6 class="flex gap-2 text-xl font-semibold line-clamp-2 max-h-12">
              {meeting.name}
            </h6>
            {#if meeting.scheduled}
              <div class="text-green-500">Scheduled ✔</div>
              <div class="flex flex-row gap-2">
                <p class="text-sm">Dec. 8</p>
                <p class="text-sm">11:00 am</p>
              </div>
            {:else}
              <div class="">
                <p class="text-sm">Dec. 8 - Dec. 9</p>
                <p class="text-sm">9:00 am - 4:00 am</p>
              </div>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  </div>
</div>
