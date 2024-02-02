<script lang="ts">
  import { Calendar } from "./Calendar";

  import MeetingContinueButton from "$lib/components/meetingSetup/MeetingContinueButton.svelte";
  import MeetingNameField from "$lib/components/meetingSetup/MeetingNameField.svelte";
  import MeetingTimeField from "$lib/components/meetingSetup/MeetingTimeField.svelte";
</script>

<div class="mx-auto min-h-fit max-w-xl bg-surface-50 p-5">
  <MeetingNameField />
  <Calendar />
  <MeetingTimeField />
  <MeetingContinueButton />
</div>
