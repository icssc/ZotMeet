<script lang="ts">
  import { Calendar, type EventInput } from '@fullcalendar/core'
  import type { EventImpl } from '@fullcalendar/core/internal'
  import interactionPlugin from '@fullcalendar/interaction'
  import listPlugin from '@fullcalendar/list'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import { onMount } from 'svelte'
  import { get, readable, writable } from 'svelte/store'
  import RangeSlider from 'svelte-range-slider-pips'

  import { handleSelect, handleSelection } from '$lib/calendar'
  import type { Reservation, ReservationEvent } from '$lib/reservation'

  let element: HTMLElement

  let calendar: Calendar

  export let onSelect = (event: EventImpl[]): unknown => event

  export let startHour = 9

  export let endHour = 21

  export let reservation = writable<Reservation>({
    id: '',
    events: [],
  })

  export let backgroundEvents = writable<EventInput[]>([])

  export let myEvents = readable<ReservationEvent[]>([])

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
        onSelect(calendar.getEvents())
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

  $: if (calendar != null) {
    calendar.setOption('slotMinTime', `${startEndHours[0]}:00:00`)
  }

  $: if (calendar != null) {
    calendar.setOption('slotMaxTime', `${startEndHours[1]}:00:00`)
  }

  $: if (calendar != null) {
    console.log($myEvents)

    calendar
      .getEvents()
      .filter((event) => event.id === 'FINALIZED')
      .forEach((event) => {
        event.remove()
      })

    $myEvents.forEach((event) => {
      calendar.addEvent({
        id: 'FINALIZED',
        start: event.start,
        end: event.end,
        display: 'background',
        backgroundColor: 'green',
      })
    })
  }
</script>

<div class="p-4 flex flex-col gap-8">
  <div class="max-w-5xl">
    <div class="w-full">
      <h3 class="text-2xl text-center font-semibold">Calendar Time Range</h3>
      <RangeSlider min={0} max={24} pips float all="label" bind:values={startEndHours} />
    </div>

    <div>
      <div bind:this={element}></div>
    </div>
  </div>
</div>
