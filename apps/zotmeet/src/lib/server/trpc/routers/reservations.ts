import { arrayOf, type } from 'arktype'

import { router, procedure } from '../init'

import { prisma } from '$lib/server/db'

const EventSchema = type({
  start: 'Date',
  end: 'Date',
})

/**
 * Handles reservations.
 */
export const reservationsRouter = router({
  /**
   * Create.
   */
  create: procedure.input(type('string | null | undefined').assert).mutation(async ({ input }) => {
    const reservation = await prisma.reservation.create({
      data: {
        userId: input,
      },
    })

    return reservation
  }),

  /**
   * Get a single reservation by its unique ID.
   */
  byId: procedure.input(type('string').assert).query(async ({ input }) => {
    const reservation = await prisma.reservation.findUnique({
      where: { id: input },
      include: {
        participants: true,
        timeSlots: true,
      },
    })
    return reservation
  }),

  /**
   * Returns all of a reservation's timeslots.
   */
  getTimeSlots: procedure.input(type('string').assert).query(async ({ input }) => {
    const timeslots = await prisma.timeSlot.findMany({
      where: {
        reservationId: input,
      },
    })

    return timeslots
  }),

  updateTimeSlots: procedure
    .input(type({ id: 'string', reservationId: 'string', events: arrayOf(EventSchema) }).assert)
    .mutation(async ({ input }) => {
      // Reset all of the user's timeslots.
      await prisma.timeSlot.deleteMany({
        where: {
          userId: input.id,
        },
      })

      // Create the new timeslots.
      const timeslots = await prisma.$transaction(
        input.events.map((event) =>
          prisma.timeSlot.create({
            data: {
              userId: input.id,
              reservationId: input.reservationId,
              start: event.start,
              end: event.end,
            },
          }),
        ),
      )

      return timeslots
    }),
})
