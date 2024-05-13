<script lang="ts">
  import { goto } from "$app/navigation";
  import Calendar from "$lib/components/creation/CalendarV2/Calendar.svelte";
  import MeetingNameField from "$lib/components/creation/MeetingV2/MeetingNameField.svelte";
  import MeetingTimeField from "$lib/components/creation/MeetingV2/MeetingTimeField.svelte";
  import { endTime, meetingName, selectedDays, startTime } from "$lib/stores/meetingSetupStores";
  import type { MeetingCreationPayload } from "$lib/types/meetings";
  import { cn } from "$lib/utils/utils";

  /**
   * Create a meeting with the selected days and times
   *
   * NOTE: This currently adds all the dates between the first and last day because the backend
   * currently only takes a start and end date.
   *
   * TODO: Update the backend to take an array of dates instead of a start and end date
   */
  const createMeeting = async () => {
    const $startingDateString = $selectedDays[0].day.toISOString();
    const $endingDateString = $selectedDays[$selectedDays.length - 1].day.toISOString();

    const res = await fetch("/api/create-meeting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: $meetingName,
        startTime: $startingDateString,
        endTime: $endingDateString,
      } satisfies MeetingCreationPayload),
    });

    if (!res.ok) {
      console.error("Failed to create meeting");
      return;
    }

    const { meeting_id }: { meeting_id: string } = await res.json();

    console.log("Meeting created with ID: ", meeting_id);

    // Redirect to the meeting page
    goto(`/availability/${meeting_id}`);
  };
</script>

<div class="px-4 pt-8 md:pl-[60px] md:pt-10">
  <h2 class="font-montserrat text-xl font-medium text-gray-dark md:text-2xl">
    Let's plan your next meeting.
  </h2>
  <h3 class="text-sm font-light text-gray-medium md:text-base">
    Select potential dates and times for you and your team.
  </h3>
</div>

<div class="w-full rounded-xl border bg-white px-8 py-6 md:px-14">
  <div class="flex flex-col gap-6">
    <MeetingNameField />
    <MeetingTimeField />
  </div>
</div>

<Calendar />

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
    on:click={createMeeting}
  >
    Continue →
  </button>
</div>
