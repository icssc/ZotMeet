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

<div class="p-8">
  <div class="px-4 py-8 space-y-4">
    <p class="text-4xl text-center font-semibold">
      Reservation ID: {data.id}
    </p>

    <div>
      <p class="opacity-50 text-lg text-center">Click and drag to select a time range.</p>
      <p class="opacity-50 text-lg text-center">Click on an existing event to remove it.</p>
    </div>
  </div>

  <div class="space-y-8">
    <div class="mx-auto max-w-4xl">
      <label class="label text-4xl font-semibold">
        <span>Select CSL Room</span>

        <select class="select" on:change|preventDefault={handleChange}>
          {#each $cslQuery.data?.roomEntries ?? [] as room}
            <option value={room[0]}>{room[1]}</option>
          {/each}
        </select>
      </label>
    </div>

    <hr class="!border-t-4 !border-dotted" />

    <div>
      <Calendar {reservation} {backgroundEvents} {myEvents} onSelect={updateTimeSlots} />
    </div>
  </div>
</div>
