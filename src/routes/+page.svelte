<script lang="ts">
  import Calendar from "$lib/components/CalendarV2/Calendar.svelte";
  import MeetingTimeField from "$lib/components/meetingSetup/MeetingTimeField.svelte";
  import ClockIcon from "~icons/material-symbols/nest-clock-farsight-analog-outline";
</script>

<main
  class="flex max-h-[calc(100vh-1.5rem)] w-full flex-col gap-y-6 overflow-y-auto rounded-tl-xl border-2 bg-white px-4 pb-6"
>
  <div class="pl-[60px] pt-10">
    <h1 class="font-montserrat text-2xl font-medium">Let's start planning your next meeting.</h1>
    <h2 class="text-base text-gray-medium">
      Select any dates and a time range that could work for you and your team.
    </h2>
  </div>

  <Calendar />

  <div class="card w-full rounded-xl border px-10">
    <div class="card-body gap-0 p-5">
      <h2 class="card-title pb-5 font-montserrat text-2xl font-medium text-gray-600">
        Meeting Details
      </h2>

      <div class="flex flex-row gap-x-1 text-slate-medium">
        <ClockIcon />
        <p class="text-sm font-bold uppercase">Meet no earlier / No later than</p>
      </div>

      <MeetingTimeField />

      <div class="card-actions justify-end">
        <button class="btn btn-primary">Buy Now</button>
      </div>
      <input type="text" placeholder="Type here" class="input w-full max-w-xs" />
    </div>
  </div>
</main>
