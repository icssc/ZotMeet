<script lang="ts">
  import { Calendar, type EventInput } from '@fullcalendar/core'
  import type { EventImpl } from '@fullcalendar/core/internal'
  import interactionPlugin from '@fullcalendar/interaction'
  import listPlugin from '@fullcalendar/list'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import { onMount } from 'svelte'
  import { get, writable } from 'svelte/store'
  import RangeSlider from 'svelte-range-slider-pips'

  import { handleSelect, handleSelection } from '$lib/calendar'
  import type { Reservation } from '$lib/reservation'

  let element: HTMLElement

  let calendar: Calendar

  export let startHour = 9

  export let endHour = 21

  export let reservation = writable<Reservation>({
    id: '',
    events: [],
  })

  export let backgroundEvents = writable<EventInput[]>([])

  let startEndHours = [9, 21]

  $: if (calendar != null) {
    calendar
      .getEvents()
      .filter((event) => event.id === 'ROOM_SLOT')
      .forEach((event) => {
        event.remove()
      })

    $backgroundEvents.forEach((event) => {
      calendar.addEvent({
        id: 'ROOM_SLOT',
        start: event.start,
        end: event.end,
        display: 'background',
        overlap: false,
        backgroundColor: 'orange',
        editable: false,
        durationEditable: false,
        startEditable: false,
      })
    })
  }

  $: if (calendar != null) {
    calendar
      .getEvents()
      .filter((event) => event.id === 'RESERVATION')
      .forEach((event) => {
        event.remove()
      })

    $reservation.events.forEach((event) => {
      calendar.addEvent({
        id: 'RESERVATION',
        start: event.start,
        end: event.end,
        display: 'background',
        overlap: false,
        backgroundColor: 'pink',
        editable: false,
        durationEditable: false,
        startEditable: false,
      })
    })
  }

  let currentEvent: EventImpl | undefined

  onMount(() => {
    calendar = new Calendar(element, {
      editable: true,
      selectable: true,
      allDaySlot: false,
      height: 'auto',
      slotMinTime: `${startHour}:00:00`,
      slotMaxTime: `${endHour}:00:00`,
      select: (arg) => {
        handleSelect(arg, calendar, get(reservation))
      },
      selectAllow: (arg) => handleSelection(arg, calendar, get(reservation)),
      eventClick: (arg) => {
        if (!arg.event.startEditable || !arg.event.durationEditable) {
          return
        }
        arg.event.remove()
        currentEvent = undefined
      },
      eventMouseEnter: (arg) => {
        currentEvent = arg.event
      },
      eventMouseLeave: () => {
        currentEvent = undefined
      },
      plugins: [timeGridPlugin, listPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: undefined,
        center: undefined,
        right: undefined,
      },
    })

    calendar.render()

    return () => {
      calendar.destroy()
    }
  })

  function onClick(): void {
    const events = calendar.getEvents()
    console.log(events)
  }

  $: if (calendar != null) {
    calendar.setOption('slotMinTime', `${startEndHours[0]}:00:00`)
  }

  $: if (calendar != null) {
    calendar.setOption('slotMaxTime', `${startEndHours[1]}:00:00`)
  }
</script>

<div class="p-4 flex flex-col gap-8">
  <div class="max-w-5xl">
    <div bind:this={element}></div>
  </div>

  <div class="p-4 flex flex-wrap gap-4">
    <div class="w-full">
      <RangeSlider min={0} max={24} pips float bind:values={startEndHours} />
    </div>

    <div>
      <button on:click={onClick} class="btn variant-filled">Get Events</button>
    </div>
  </div>

  {#if currentEvent}
    <div>
      <p>You're hovering over:</p>
      <pre>{JSON.stringify(currentEvent, undefined, 2)}</pre>
    </div>
  {/if}
</div>
