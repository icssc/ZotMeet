<script lang="ts">
  /**
   *
   * array of selectedDays makes a table, which is array of availability
   * Intended behavior:
   * 1. can set beginning and end time, each row is 30 minutes ? or 1 hr
   * 2. Drag behavior depends on initial block selection -
   *  initial block selected -> unselects everything
   *  initial block not selected -> selects everything
   */

  let givenDays: string[] = ["January 11", "January 12", "January 13", "January 15", "January 16"];
  // let startTime : string  = "8:00:00"
  // let endTime : string = "12:00:00"
</script>

<table class="w-full">
  <thead>
    <tr>
      {#each givenDays as day}
        <th>{day}</th>
      {/each}
    </tr>
  </thead>
</table>
