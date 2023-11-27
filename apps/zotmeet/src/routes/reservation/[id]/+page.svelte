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

  const backgroundEvents = writable<EventInput[]>([])

  const cslQuery = trpc.csl.byId.createQuery(405)

  const reservationQuery = trpc.reservations.byId.createQuery(data.id)

  const mutation = trpc.reservations.updateTimeSlots.createMutation()

  const utils = trpc.getContext()

  function randomTimeSlotThisWeek(): { start: Date; end: Date } {
    const start = dayjs()
      .startOf('week')
      .add(Math.random() * 3, 'day')
      .hour(10 + Math.random() * 10)
      .toDate()
    const end = dayjs(start).add(1, 'hour').toDate()
    return { start, end }
  }

  function updateTimeSlots(): void {
    const { start, end } = randomTimeSlotThisWeek()

    $mutation.mutate(
      {
        id: $page.data.session?.user?.id,
        reservationId: data.id,
        events: [{ start, end }],
      },
      {
        onSuccess: () => {
          void utils.reservations.invalidate()

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
</script>

<div>
  <p class="text-4xl text-center font-semibold px-8 py-16">
    Reservation ID: {data.id}
  </p>

  <div>
    <Calendar {reservation} {backgroundEvents} />
  </div>
</div>
