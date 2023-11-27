<script lang="ts">
  import { trpc } from '$lib/client/trpc'

  const query = trpc.csl.createQuery()
</script>

<div class="flex flex-col gap-4">
  {#each $query.data ?? [] as slot}
    <div>
      <p>{slot.segment_id}</p>
      <p>{slot.segment_start_time}</p>
      <div class="flex flex-col gap-2 border-4">
        {#each slot.rooms as room}
          <div class="border-4 border-red-500">
            <p>{room.room_id}</p>
            <p>{room.room_name}</p>
            <p>{room.room_capacity}</p>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
