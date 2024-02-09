<script lang="ts">
  import { Table, type TableSource, tableSourceValues } from "@skeletonlabs/skeleton";

  import { endTime, meetingName, startTime } from "$lib/stores/meetingSetupStores";

  const mockTimes = [
    ["08:00", true, false, true, false, true],
    ["8:30", true, false, true, false, true],
    ["9:00", true, false, true, false, true],
    ["9:30", true, false, true, false, true],
    ["10:00", true, false, true, false, true],
  ];
  const mockLabels = ["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const mockTable: TableSource = {
    head: mockLabels,
    body: tableSourceValues(mockTimes),
  };
</script>

<div class="flex flex-col gap-8 px-4 pt-8 md:px-32">
  <div class="flex flex-col gap-4">
    <h1 class="border-surface-400-500-token border-b text-4xl font-bold">{$meetingName}</h1>
    <Table source={mockTable} />

    <p>Start: {$startTime}</p>
    <p>End: {$endTime}</p>
  </div>
</div>
