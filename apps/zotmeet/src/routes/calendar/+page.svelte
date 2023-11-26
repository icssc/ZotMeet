<script lang="ts">
  import { Calendar } from '@fullcalendar/core'
  import type { EventImpl } from '@fullcalendar/core/internal'
  import interactionPlugin from '@fullcalendar/interaction'
  import listPlugin from '@fullcalendar/list'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import { onMount } from 'svelte'

  import { handleSelect, handleSelection } from '$lib/calendar'

  let element: HTMLElement

  let calendar: Calendar

  export let startHour = 9

  export let endHour = 21

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
        handleSelect(arg, calendar)
      },
      selectAllow: (arg) => handleSelection(arg, calendar),
      eventClick: (arg) => {
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

  const hours = Array.from({ length: 25 }, (_, i) => i)

  function handleStartSelect(e: SvelteInputEvent<Event, HTMLSelectElement>): void {
    startHour = +e.currentTarget.value
    calendar.setOption('slotMinTime', `${startHour}:00:00`)
  }

  function handleEndSelect(e: SvelteInputEvent<Event, HTMLSelectElement>): void {
    endHour = +e.currentTarget.value
    calendar.setOption('slotMaxTime', `${endHour}:00:00`)
  }
</script>

<div class="p-4 flex flex-col gap-8">
  <div class="max-w-5xl">
    <div bind:this={element}></div>
  </div>

  <div class="p-4 flex flex-wrap gap-4">
    <div class="w-full flex gap-8">
      <label class="w-full">
        <span>Start Hour</span>
        <select class="select" on:change={handleStartSelect} value={startHour}>
          {#each hours as hour}
            <option value={hour}>{hour}</option>
          {/each}
        </select>
      </label>

      <label class="w-full">
        <span>End Hour</span>
        <select class="select" on:change={handleEndSelect} value={endHour}>
          {#each hours as hour}
            <option value={hour}>{hour}</option>
          {/each}
        </select>
      </label>
    </div>

    <div>
      <button on:click={onClick} class="btn variant-filled">Get Events</button>
    </div>
  </div>

  {#if currentEvent}
    <div>
      <p>You're hovering over:</p>
      <pre>{JSON.stringify(currentEvent, null, 2)}</pre>
    </div>
  {/if}
</div>
