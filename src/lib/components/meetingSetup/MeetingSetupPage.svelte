<script lang="ts">
  import { Calendar } from "./Calendar";

  import MeetingNameField from "$lib/components/meetingSetup/MeetingNameField.svelte";
  import MeetingTimeField from "$lib/components/meetingSetup/MeetingTimeField.svelte";
</script>

<div class="mx-auto max-w-xl bg-surface-50 p-5">
  <MeetingNameField />
  <Calendar />
  <MeetingTimeField />
</div>
