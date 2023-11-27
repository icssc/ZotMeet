<script lang="ts">
  import { trpc } from '$lib/client/trpc'

  const query = trpc.scienceLibrary.createQuery()
</script>

<div>
  {#if $query.data == null}
    <p>Loading...</p>
  {:else}
    <div class="">
      <div>
        <p>Is pre-created booking: {$query.data.isPreCreatedBooking}</p>
        <p>Window end: {$query.data.windowEnd}</p>
      </div>
      <div class="flex flex-col gap-2 border-4 border-blue-500">
        {#each $query.data.slots as slot}
          <div class="border-2 border-purple-500">
            <p>Start: {slot.start}</p>
            <p>End: {slot.end}</p>
            <p>Item ID: {slot.itemId}</p>
            <p>Checksum: {slot.checksum}</p>
            <p>Classname: {slot.className}</p>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
