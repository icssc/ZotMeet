import { Calendar, type CalendarOptions } from '@fullcalendar/core'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayjs from 'dayjs'
import { describe, test, expect } from 'vitest'

import {
  handleSelect,
  handleSelection,
  getSelection,
  getDaysOfWeek,
  PENDING_KEY,
} from '../src/lib/calendar'

function createCalendar(
  options?: CalendarOptions,
  element: HTMLElement = document.createElement('div'),
) {
  return new Calendar(element, {
    initialView: 'timeGridWeek',
    plugins: [timeGridPlugin],
    ...options,
  })
}

/**
 * Creates a calendar with 5 events: 12AM - 6AM on Sunday - Thursday.
 */
function createCalendarWithEvents() {
  const numbers = Array.from({ length: 5 }, (_, i) => i)

  return createCalendar({
    events: numbers.map((number) => ({
      start: dayjs('00:00:00', 'HH:mm:ss').day(number).toDate(),
      end: dayjs('06:00:00', 'HH:mm:ss').day(number).toDate(),
    })),
  })
}

describe('calendar', () => {
  describe('createCalendar', () => {
    test('it works', () => {
      const calendar = createCalendar()
      expect(calendar).toBeInstanceOf(Calendar)
    })
  })

  describe('handleSelect', () => {
    test('selects ranges properly', () => {
      const calendar = createCalendar()

      handleSelect(
        {
          start: dayjs('00:00:00', 'HH:mm:ss').day(0).toDate(),
          end: dayjs('06:00:00', 'HH:mm:ss').day(4).toDate(),
          startStr: '',
          endStr: '',
          allDay: false,
        },
        calendar,
      )

      const events = calendar.getEvents()
      expect(events).toHaveLength(5)
    })

    test('removes pending events', () => {
      const calendar = createCalendar()

      calendar.addEvent({
        start: dayjs('00:00:00', 'HH:mm:ss').day(0).toDate(),
        end: dayjs('06:00:00', 'HH:mm:ss').day(0).toDate(),
        id: PENDING_KEY,
      })

      handleSelect(
        {
          start: dayjs('00:00:00', 'HH:mm:ss').day(0).toDate(),
          end: dayjs('06:00:00', 'HH:mm:ss').day(4).toDate(),
          startStr: '',
          endStr: '',
          allDay: false,
        },
        calendar,
      )

      expect(calendar.getEvents()).toHaveLength(5)
    })
  })

  describe('handleSelection', () => {
    test('removes previous PENDING events', () => {
      const calendar = createCalendar()

      handleSelection(
        {
          start: dayjs().toDate(),
          end: dayjs().add(1, 'days').toDate(),
          startStr: '',
          endStr: '',
          allDay: false,
        },
        calendar,
      )

      expect(calendar.getEvents()).toHaveLength(2)

      handleSelection(
        {
          start: dayjs().toDate(),
          end: dayjs().add(3, 'days').toDate(),
          startStr: '',
          endStr: '',
          allDay: false,
        },
        calendar,
      )

      expect(calendar.getEvents()).toHaveLength(4)
    })

    describe('properly handles event manipulation', () => {
      test('removes events that are fully contained within the selection', () => {
        /**
         * Three events from 12AM to 5AM on Sunday, Monday, and Tuesday.
         */
        const calendar = createCalendar({
          events: [
            {
              start: dayjs('00:00:00', 'HH:mm:ss').day(0).toDate(),
              end: dayjs('05:00:00', 'HH:mm:ss').day(0).toDate(),
            },
            {
              start: dayjs('00:00:00', 'HH:mm:ss').day(1).toDate(),
              end: dayjs('05:00:00', 'HH:mm:ss').day(1).toDate(),
            },
            {
              start: dayjs('00:00:00', 'HH:mm:ss').day(2).toDate(),
              end: dayjs('05:00:00', 'HH:mm:ss').day(2).toDate(),
            },
          ],
        })

        /**
         * Adding a selection from 12AM to 6AM on Monday should remove the event from 12AM to 5AM on Monday.
         */
        handleSelection(
          {
            start: dayjs('00:00:00', 'HH:mm:ss').day(1).toDate(),
            end: dayjs('06:00:00', 'HH:mm:ss').day(1).toDate(),
            startStr: '',
            endStr: '',
            allDay: false,
          },
          calendar,
        )

        /**
         * Removing the old event and adding the new one esults in three events total.
         */
        expect(calendar.getEvents()).toHaveLength(3)
      })

      describe('properly shifts time range of existing events', () => {
        describe('selection only spans one day', () => {
          test('existing event start time shifts forward if it starts after selection starts', () => {
            const id = 'event'

            /**
             * An event from 12AM to 6AM today.
             */
            const calendar = createCalendar({
              events: [
                {
                  id,
                  start: dayjs('00:00:00', 'HH:mm:ss').toDate(),
                  end: dayjs('06:00:00', 'HH:mm:ss').toDate(),
                },
              ],
            })

            /**
             * Adding a selection from 12AM to 3AM today should shift the first event from 3AM to 6AM.
             */
            handleSelection(
              {
                start: dayjs('00:00:00', 'HH:mm:ss').toDate(),
                end: dayjs('03:00:00', 'HH:mm:ss').toDate(),
                startStr: '',
                endStr: '',
                allDay: false,
              },
              calendar,
            )

            /**
             * The event should now be from 12AM to 3AM.
             */
            const event = calendar.getEventById(id)

            expect(event?.start?.getHours()).toEqual(3)
            expect(event?.end?.getHours()).toEqual(6)
          })

          test('existing event end time shifts backward if it ends before selection ends', () => {
            const id = 'event'

            /**
             * An event from 12AM to 6AM today.
             */
            const calendar = createCalendar({
              events: [
                {
                  id,
                  start: dayjs('00:00:00', 'HH:mm:ss').toDate(),
                  end: dayjs('06:00:00', 'HH:mm:ss').toDate(),
                },
              ],
            })

            /**
             * Adding a selection from 3AM to 6AM today should shift the first event from 12AM to 3AM.
             */
            handleSelection(
              {
                start: dayjs('03:00:00', 'HH:mm:ss').toDate(),
                end: dayjs('06:00:00', 'HH:mm:ss').toDate(),
                startStr: '',
                endStr: '',
                allDay: false,
              },
              calendar,
            )

            /**
             * The event should now be from 12AM to 3AM.
             */
            const event = calendar.getEventById(id)

            expect(event?.start?.getHours()).toEqual(0)
            expect(event?.end?.getHours()).toEqual(3)
          })
        })

        /**
         * @remarks SOME NOTES ARE LEFT IN THIS FIRST TEST CASE.
         */
        describe('selection spans multiple days', () => {
          /**
           * The user clicks at Sunday 12AM and drags towards Monday 3AM.
           * This results in a rectangular box spanning Sunday 12AM to Monday 3AM.
           */
          test('shifts existing event starts forward if they start after selection starts', () => {
            const calendar = createCalendarWithEvents()

            /**
             * Select a date range from Sunday 12AM to Monday 3AM.
             */
            handleSelection(
              {
                start: dayjs('00:00:00', 'HH:mm:ss').day(0).toDate(),
                end: dayjs('03:00:00', 'HH:mm:ss').day(1).toDate(),
                startStr: '',
                endStr: '',
                allDay: false,
              },
              calendar,
            )

            /**
             *
             * @SEE These notes!
             *
             * There should be three events:
             * 1. Sunday 12AM to 3AM -- newly added
             * 2. Sunday 3AM to 5AM -- existing time that was shrunk
             * 3. Monday 12AM to 3AM -- newly added
             *
             * This is because of the nature of "rectangular selection".
             *
             * Selecting a range from Monday 12AM to Tuesday 3AM is like drawing a box
             * where the top left corner is Monday 12AM and the bottom right corner is Tuesday 3AM.
             *
             * FullCalendar wants to draw a continuous time range in between them, but we want a box.
             *
             * (I won't re-explain this in subsequent tests)
             */
            const events = calendar.getEvents()

            /**
             * Convert all the relevant properties to numbers for easy comparison.
             */
            const dayStartEnd = events.map((event) => ({
              day: event.start?.getDay(),
              start: event.start?.getHours(),
              end: event.end?.getHours(),
            }))

            /**
             * New - Sunday 12AM to 3AM
             */
            expect(dayStartEnd).toContainEqual({ day: 0, start: 0, end: 3 })

            /**
             * New - Monday 12AM to 3AM
             */
            expect(dayStartEnd).toContainEqual({ day: 1, start: 0, end: 3 })

            /**
             * Shifted - Sunday 3AM to 6AM, used to be Sunday 12AM to 6AM
             */
            expect(dayStartEnd).toContainEqual({ day: 0, start: 3, end: 6 })
          })
        })
      })
    })
  })

  describe('getSelection', () => {
    test('returns the start and end as they were given if the start is before the end', () => {
      const start = dayjs()
      const end = dayjs().add(1, 'day')

      const result = getSelection({
        start: start.toDate(),
        end: end.toDate(),
        startStr: '',
        endStr: '',
        allDay: false,
      })

      expect(result.start.isSame(start)).toBeTruthy()
      expect(result.end.isSame(end)).toBeTruthy()
    })

    test('swaps the start and end if the start is after the end', () => {
      const start = dayjs()
      const end = dayjs().subtract(1, 'day')

      const result = getSelection({
        start: start.toDate(),
        end: end.toDate(),
        startStr: '',
        endStr: '',
        allDay: false,
      })

      expect(result.start.isSame(end)).toBeTruthy()
      expect(result.end.isSame(start)).toBeTruthy()
    })

    test('adds thirty minutes to the end if the start and end are the same and the start is before the end', () => {
      const start = dayjs()
      const end = dayjs()

      const result = getSelection({
        start: start.toDate(),
        end: end.toDate(),
        startStr: '',
        endStr: '',
        allDay: false,
      })

      expect(result.start.isSame(start)).toBeTruthy()
      expect(result.end.isSame(end.add(30, 'minutes'))).toBeTruthy()
    })
  })

  describe('getDaysOfWeek', () => {
    test('returns the shared day if the start and end are the same day', () => {
      const friday = 5

      const start = dayjs().day(friday).toDate()
      const end = dayjs().day(friday).toDate()

      const result = getDaysOfWeek({
        start,
        end,
        startStr: '',
        endStr: '',
        allDay: false,
      })

      expect(result).toEqual([friday])
    })

    test('returns day indices between Monday and Friday', () => {
      const start = dayjs().day(1).toDate()
      const end = dayjs().day(5).toDate()

      const result = getDaysOfWeek({
        start,
        end,
        startStr: '',
        endStr: '',
        allDay: false,
      })

      expect(result).toEqual([1, 2, 3, 4, 5])
    })

    test('returns day indices between Tuesday and Thursday', () => {
      const start = dayjs().day(2).toDate()
      const end = dayjs().day(4).toDate()

      const result = getDaysOfWeek({
        start,
        end,
        startStr: '',
        endStr: '',
        allDay: false,
      })

      expect(result).toEqual([2, 3, 4])
    })

    test('returns day indices between Monday and Saturday', () => {
      const start = dayjs().day(1).toDate()
      const end = dayjs().day(6).toDate()

      const result = getDaysOfWeek({
        start,
        end,
        startStr: '',
        endStr: '',
        allDay: false,
      })

      expect(result).toEqual([1, 2, 3, 4, 5, 6])
    })

    /**
     * Dynamically test all days of the week, starting and ending on different days.
     * Passing the tests isn't really insightful because it's basically the implementation.
     * It's kept here as an example.
     */

    // allDays.forEach((startDay) => {
    //   test.each(allDays)(`returns array with day indicies from ${startDay} to %i`, (endDay) => {
    //     const start = dayjs().day(startDay).toDate()
    //     const end = dayjs().day(endDay).toDate()

    //     const result = getDaysOfWeek({
    //       start,
    //       end,
    //       startStr: '',
    //       endStr: '',
    //       allDay: false,
    //     })

    //     const expected = Array.from({ length: endDay - startDay + 1 }, (_, i) => i + startDay)

    //     expect(result).toEqual(expected)
    //   })
    // })
  })
})
