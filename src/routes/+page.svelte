<script lang="ts">
  import Calendar from "$lib/components/CalendarV2/Calendar.svelte";
  import MeetingNameField from "$lib/components/MeetingV2/MeetingNameField.svelte";
  import MeetingTimeField from "$lib/components/MeetingV2/MeetingTimeField.svelte";
  import { selectedDays } from "$lib/stores/meetingSetupStores";
  import { startTime, endTime } from "$lib/stores/meetingSetupStores";
  import { meetingName } from "$lib/stores/meetingSetupStores";
  import { cn } from "$lib/utils/utils";
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

      <div class="flex flex-col gap-8">
        <MeetingTimeField />
        <MeetingNameField />
      </div>
    </div>
  </div>

  <div class="flex flex-row items-center justify-end gap-x-4">
    <p class="text-sm font-bold uppercase text-slate-medium">
      {$selectedDays.length} days selected
    </p>
    <button
      class={cn(
        "btn btn-wide border-none bg-success font-montserrat text-xl font-medium text-gray-light",
      )}
      disabled={$selectedDays.length > 0 && $startTime && $endTime && $meetingName ? false : true}
    >
      Continue →
    </button>
  </div>
</main>
