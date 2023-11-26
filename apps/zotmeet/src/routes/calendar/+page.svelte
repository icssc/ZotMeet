<script lang="ts">
  import { Calendar } from '@fullcalendar/core'
  import interactionPlugin from '@fullcalendar/interaction'
  import listPlugin from '@fullcalendar/list'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import { onMount } from 'svelte'

  import { handleSelect, handleSelection } from '$lib/calendar'

  let element: HTMLElement

  let calendar: Calendar

  onMount(() => {
    calendar = new Calendar(element, {
      editable: true,
      selectable: true,
      select: (arg) => {
        handleSelect(arg, calendar)
      },
      selectAllow: (arg) => handleSelection(arg, calendar),
      plugins: [timeGridPlugin, listPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
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
</script>

<div bind:this={element}></div>

<button on:click={onClick} class="btn variant-filled">Get Events</button>
