<script lang="ts">
  import type { EventInput } from '@fullcalendar/core/index.js'
  import dayjs from 'dayjs'
  import { writable } from 'svelte/store'

  import type { PageData } from './$types'

  import { page } from '$app/stores'
  import { trpc } from '$lib/client/trpc'
  import Calendar from '$lib/components/Calendar.svelte'
  import type { Reservation } from '$lib/reservation'

  export let data: PageData

  const reservation = writable<Reservation>({
    id: data.id,
    events: [],
  })

  const cslQuery = trpc.csl.byId.createQuery(405)

  const backgroundEvents = writable<EventInput[]>([])

  const reservationQuery = trpc.reservations.byId.createQuery(data.id)

  $: console.log($reservationQuery.data)

  const mutation = trpc.reservations.updateTimeSlots.createMutation()

  const utils = trpc.getContext()

  let participantId = $page.data.session?.user?.id ?? 'Anonymous'

  function randomTimeSlotThisWeek(): { start: Date; end: Date } {
    const start = dayjs()
      .startOf('week')
      .add(Math.random() * 3, 'day')
      .hour(10 + Math.random() * 10)
      .toDate()
    const end = dayjs(start).add(1, 'hour').toDate()
    return { start, end }
  }

  $: if ($cslQuery.data !== null && $cslQuery.data !== undefined) {
    backgroundEvents.set(
      $cslQuery.data.map((room) => ({
        start: room.start,
        end: room.end,
        display: 'background',
        overlap: false,
        backgroundColor: 'pink',
        editable: false,
        durationEditable: false,
        startEditable: false,
      })),
    )
  }

  function updateTimeSlots(): void {
    const { start, end } = randomTimeSlotThisWeek()

    $mutation.mutate(
      {
        id: participantId,
        reservationId: data.id,
        events: [{ start, end }],
      },
      {
        onSuccess: () => {
          void utils.reservations.getTimeSlots.invalidate(data.id)

          void utils.reservations.getTimeSlots.fetch(data.id).then((result) => {
            reservation.set({
              id: data.id,
              events: result,
            })
          })
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
    <pre>{JSON.stringify($reservationQuery.data?.timeSlots, undefined, 2)}</pre>
  </div>

  <Calendar {reservation} {backgroundEvents} />

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
