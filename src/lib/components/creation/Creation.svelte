<script lang="ts">
  import { goto } from "$app/navigation";
  import Calendar from "$lib/components/creation/CalendarV2/Calendar.svelte";
  import MeetingNameField from "$lib/components/creation/MeetingV2/MeetingNameField.svelte";
  import MeetingTimeField from "$lib/components/creation/MeetingV2/MeetingTimeField.svelte";
  import { selectedDays } from "$lib/stores/meetingSetupStores";
  import { startTime, endTime } from "$lib/stores/meetingSetupStores";
  import { meetingName } from "$lib/stores/meetingSetupStores";
  import type { CreateMeetingPostParams } from "$lib/types/meetings";
  import { cn } from "$lib/utils/utils";

  /**
   * Converts a time string in the format "HH:MM" to an ISO string.
   * @param time
   */
  function timeStringToIso(time: string): string {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toISOString();
  }

  const handleCreation = async () => {
    const body: CreateMeetingPostParams = {
      title: $meetingName,
      fromTime: timeStringToIso($startTime),
      toTime: timeStringToIso($endTime),
      meetingDates: $selectedDays.map((zotDate) => zotDate.day.toISOString()),
      description: "",
    };

    const response: Response = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("Failed to create meeting: ", response.statusText);
      return;
    }

    const { meetingId } = await response.json();

    if (!meetingId) {
      console.error("Failed to create meeting. Meeting ID not found.");
      return;
    }

    goto(`/availability/${meetingId}`);
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
    on:click={handleCreation}
  >
    Continue →
  </button>
</div>
