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
  import { selectedAvailability } from "$lib/stores/availabilityStores";

  let givenDays: string[] = ["2024-01-10", "2024-01-11", "2024-01-13", "2024-01-15", "2024-01-17"];
  $: selectedAvailability;
  selectedAvailability.initialize(givenDays);

  // const constructAvailability = (): boolean[][] => {
  //   return $selectedAvailability.map((av) => av.getAvailabilities())
  // }
</script>

<!--<table class="w-full">-->
<!--  <thead>-->
<!--    <tr>-->
<!--      <th>Time</th>-->
<!--      {#each givenDays as day,i (i)}-->
<!--        <th scope="col">{day}</th>-->
<!--      {/each}-->
<!--    </tr>-->
<!--    {#each  c}-->
<!--      <tr>-->
<!--        <th scope="row">{av}</th>-->
<!--      </tr>-->
<!--      {#each av.getAvailabilities() as block}-->
<!--        block-->
<!--      {/each}-->
<!--    {/each}-->
<!--  </thead>-->
<!--</table>-->
