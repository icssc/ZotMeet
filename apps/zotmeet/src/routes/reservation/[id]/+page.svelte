<script lang="ts">
  import type { EventImpl } from '@fullcalendar/core/internal'
  import { derived } from 'svelte/store'

  import type { PageData } from './$types'

  import { page } from '$app/stores'
  import { trpc } from '$lib/client/trpc'
  import Calendar from '$lib/components/Calendar.svelte'

  export let data: PageData

  const cslQuery = trpc.csl.byId.createQuery(406)

  const reservationQuery = trpc.reservations.byId.createQuery(data.id)

  const mutation = trpc.reservations.updateTimeSlots.createMutation()

  const utils = trpc.getContext()

  function updateTimeSlots(events: EventImpl[]): void {
    const myEvents = events
      .filter((event) => event.id === 'FINALIZED')
      .map((event) => ({
        start: event.start ?? new Date(),
        end: event.end ?? new Date(),
      }))

    $mutation.mutate(
      {
        id: $page.data.session?.user?.id,
        reservationId: data.id,
        events: myEvents,
      },
      {
        onSuccess: () => {
          void utils.reservations.invalidate()
        },
      },
    )
  }

  const myEvents = derived(
    reservationQuery,
    ($reservationQuery) => $reservationQuery.data?.timeSlots ?? [],
  )

  const reservation = derived(reservationQuery, ($reservationQuery) => {
    const events =
      $reservationQuery.data?.timeSlots.filter((t) => t.userId !== $page.data.session?.user?.id) ??
      []

    return {
      id: $reservationQuery.data?.id ?? '',
      events,
    }
  })

  const backgroundEvents = derived(
    cslQuery,
    ($cslQuery) =>
      $cslQuery.data?.map((room) => ({
        start: room.start,
        end: room.end,
        display: 'background',
        overlap: false,
        backgroundColor: 'pink',
        editable: false,
        durationEditable: false,
        startEditable: false,
      })) ?? [],
  )
</script>

<div>
  <p class="text-4xl text-center font-semibold px-8 py-16">
    Reservation ID: {data.id}
  </p>

  <div>
    <Calendar {reservation} {backgroundEvents} {myEvents} onSelect={updateTimeSlots} />
  </div>
</div>
