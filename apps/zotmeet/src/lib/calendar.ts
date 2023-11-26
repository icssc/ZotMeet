import type { Calendar, DateSpanApi } from '@fullcalendar/core'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

export interface DayJSSelection {
  start: dayjs.Dayjs
  end: dayjs.Dayjs
}

export function getSelection(arg: DateSpanApi): DayJSSelection {
  const start = dayjs(arg.start)
  let end = dayjs(arg.end)

  if (start.isSame(end)) {
    end = end.add(30, 'minutes')
  }

  // Remove the day difference, and only compare the time. i.e. HH:mm
  // If the end is before the start, then switch the two.
  // When it's added to the calendar, only the HH:mm component is used, so we compare that instead of the full date.

  const endIsBefore = end.day(0).isBefore(start.day(0))

  return endIsBefore ? { start: end, end: start } : { start, end }
}

export function getDaysOfWeek(arg: DateSpanApi): number[] {
  const { start, end } = arg

  const daysOfWeek = []

  for (let i = start.getDay(); i <= end.getDay(); i += 1) {
    daysOfWeek.push(i)
  }

  return daysOfWeek
}

export function handleSelect(arg: DateSpanApi, calendar: Calendar): void {
  calendar.getEventById('PENDING')?.remove()

  const startEndTime = getSelection(arg)

  getDaysOfWeek(arg).forEach((day) => {
    const start = startEndTime.start.day(day).toDate()
    const end = startEndTime.end.day(day).toDate()
    calendar.addEvent({ start, end, backgroundColor: 'purple' })
  })
}

export function handleSelection(arg: DateSpanApi, calendar: Calendar): boolean {
  calendar.getEventById('PENDING')?.remove()

  const daysOfWeek = getDaysOfWeek(arg)
  const { start, end } = getSelection(arg)

  calendar.getEvents().forEach((event) => {
    if (event.start == null || event.end == null) {
      return
    }

    if (!daysOfWeek.includes(event.start.getDay())) {
      return
    }

    /**
     * Convert the selection into Dayjs recurring events.
     */
    const selectionAsRecurring = daysOfWeek.map((day) => {
      const selectionStart = dayjs(start).day(day)
      const selectionEnd = dayjs(end).day(day)
      return { start: selectionStart, end: selectionEnd }
    })

    selectionAsRecurring.forEach((selection) => {
      const eventStart = dayjs(event.start)
      const eventEnd = dayjs(event.end)

      const startIsBetween = eventStart.isBetween(selection.start, selection.end, 'minute', '[]')
      const endIsBetween = eventEnd.isBetween(selection.start, selection.end, 'minute', '[]')

      if (startIsBetween && endIsBetween) {
        event.remove()
      } else if (startIsBetween) {
        event.setStart(selection.end.toDate())
      } else if (endIsBetween) {
        event.setEnd(selection.start.toDate())
      }
    })
  })

  calendar.addEvent({
    id: 'PENDING',
    startTime: start.format('HH:mm'),
    endTime: end.format('HH:mm'),
    daysOfWeek,
    backgroundColor: 'pink',
  })

  return true
}
