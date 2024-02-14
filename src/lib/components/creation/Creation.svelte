<script lang="ts">
  import Calendar from "$lib/components/creation/CalendarV2/Calendar.svelte";
  import MeetingNameField from "$lib/components/creation/MeetingV2/MeetingNameField.svelte";
  import MeetingTimeField from "$lib/components/creation/MeetingV2/MeetingTimeField.svelte";
  import { selectedDays } from "$lib/stores/meetingSetupStores";
  import { startTime, endTime } from "$lib/stores/meetingSetupStores";
  import { meetingName } from "$lib/stores/meetingSetupStores";
  import { cn } from "$lib/utils/utils";
</script>

<div class="px-2 pt-8 md:px-4 md:pt-10 lg:pl-[60px]">
  <h1 class="font-montserrat text-xl font-semibold md:text-2xl">Let's plan your next meeting.</h1>
  <h2 class="text-sm font-light text-gray-medium md:text-base">
    Select dates and times for you and your team.
  </h2>
</div>

<Calendar />

<div class="card w-full rounded-xl border p-8 md:px-10">
  <div class="card-body gap-0 p-0 md:p-5">
    <h2 class="card-title pb-5 font-montserrat text-xl font-semibold text-gray-600 md:text-2xl">
      Meeting Details
    </h2>

    <div class="flex flex-col gap-8">
      <MeetingTimeField />
      <MeetingNameField />
    </div>
  </div>
</div>

<div
  class="sticky bottom-0 -ml-2 flex w-[100vw] flex-row items-center justify-end gap-x-4 border-t-[1px] bg-white p-3 md:relative md:w-full md:border-t-0 md:bg-transparent md:py-0"
>
  <p class="text-sm font-bold uppercase text-slate-medium">
    {$selectedDays.length} days selected
  </p>
  <button
    class={cn(
      "btn w-48 border-none bg-success font-montserrat text-xl font-medium text-gray-light sm:btn-wide",
    )}
    disabled={$selectedDays.length > 0 && $startTime && $endTime && $meetingName ? false : true}
  >
    Continue →
  </button>
</div>
