<script lang="ts">
  import { trpc } from '$lib/client/trpc'

  const query = trpc.csl.createQuery()
</script>

<div class="flex flex-col gap-4">
  {#each $query.data ?? [] as slot}
    <div class="border-4 border-red-400">
      <div class="flex w-full justify-center items-center gap-4">
        <p class="text-4xl font-bold text-center">{slot.segment_start_time}</p>
        <p>Segment ID: {slot.segment_id}</p>
      </div>

      <div class="flex flex-col gap-2">
        {#each slot.rooms as room}
          <div class="border border-yellow-500">
            <p>Room ID: {room.room_id}</p>
            <p>Room Name: {room.room_name}</p>
            <p>Room Capacity: {room.room_capacity}</p>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
