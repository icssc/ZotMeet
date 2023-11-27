<script lang="ts">
  import type { EventInput } from '@fullcalendar/core/index.js'
  import type { EventImpl } from '@fullcalendar/core/internal'
  import { derived, writable } from 'svelte/store'

  import type { PageData } from './$types'

  import { page } from '$app/stores'
  import { trpc } from '$lib/client/trpc'
  import Calendar from '$lib/components/Calendar.svelte'

  export let data: PageData

  const cslQuery = trpc.csl.rooms.createQuery()

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

  const backgroundEvents = writable<EventInput[]>([])

  async function handleChange(e: SvelteInputEvent<Event, HTMLSelectElement>): Promise<void> {
    const { value } = e.currentTarget
    const newRoomSlots = await utils.csl.getById.fetch(+value)
    backgroundEvents.set(newRoomSlots)
  }
</script>

<div>
  <p class="text-4xl text-center font-semibold px-8 py-16">
    Reservation ID: {data.id}
  </p>

  <div class="flex gap-4">
    <div>
      <Calendar {reservation} {backgroundEvents} {myEvents} onSelect={updateTimeSlots} />
    </div>

    <div>
      <div>
        <label class="label text-4xl font-semibold">
          <span>Select CSL Room</span>

          <select class="select" on:change|preventDefault={handleChange}>
            {#each $cslQuery.data?.roomEntries ?? [] as room}
              <option value={room[0]}>{room[1]}</option>
            {/each}
          </select>
        </label>
      </div>
    </div>
  </div>
</div>
