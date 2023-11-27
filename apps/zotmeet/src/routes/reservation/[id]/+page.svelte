<script lang="ts">
  import dayjs from 'dayjs'

  import type { PageData } from './$types'

  import { trpc } from '$lib/client/trpc'

  export let data: PageData

  const query = trpc.reservations.getTimeSlots.createQuery(data.id)

  const mutation = trpc.reservations.updateTimeSlots.createMutation()

  const utils = trpc.getContext()

  let participantId = ''

  function updateTimeSlots(): void {
    $mutation.mutate(
      {
        id: 'Anonymous',
        reservationId: data.id,
        events: [
          {
            start: dayjs().add(1, 'day').toDate(),
            end: dayjs().add(1, 'day').add(1, 'hour').toDate(),
          },
        ],
      },
      {
        onSuccess: () => {
          void utils.reservations.getTimeSlots.invalidate(data.id)
        },
      },
    )
  }
</script>

<div class="flex flex-col">
  <p class="text-4xl text-center font-semibold">
    Reservation ID: {data.id}
  </p>

  <div>
    <p>Time slots</p>
    <pre>{JSON.stringify($query.data, undefined, 2)}</pre>
  </div>

  <div>
    <button class="btn variant-filled-primary" on:click={updateTimeSlots}>Update timeslot</button>
  </div>

  <div>
    <label class="label">
      <span class="">Participant ID</span>
      <input type="text" bind:value={participantId} class="input" />
    </label>
  </div>
</div>
