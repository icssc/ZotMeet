<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    availabilityDates,
    availabilityTimeBlocks,
    generateTimeBlocks,
    getTimeFromString,
  } from "$lib/stores/availabilityStores";
  import { selectedDays, startTime, endTime } from "$lib/stores/meetingSetupStores";
  import { ZotDate } from "$lib/utils/ZotDate";

  const onClick = () => {
    const earliest = getTimeFromString($startTime);
    const latest = getTimeFromString($endTime);
    const timeBlocks = generateTimeBlocks(earliest, latest);

    availabilityDates.set($selectedDays);
    availabilityTimeBlocks.set(timeBlocks);
    if ($availabilityDates.length > 0 && latest > earliest) {
      ZotDate.initializeAvailabilities($availabilityDates, earliest, latest);
      goto("/availability");
    }
  };
</script>

<button type="button" class="variant-filled btn mx-auto my-5 h-12 w-full" on:click={onClick}
  >Create Event</button
>
