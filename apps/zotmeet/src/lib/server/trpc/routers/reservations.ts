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
  create: procedure.input(type('string').assert).mutation(async ({ input }) => {
    const reservation = await prisma.reservation.create({
      data: {
        user_id: input,
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
        ReservationParticipant: true,
        TimeSlot: true,
      },
    })
    return reservation
  }),

  updateTimeSlots: procedure
    .input(type({ id: 'string', reservationId: 'string', events: arrayOf(EventSchema) }).assert)
    .mutation(async ({ input }) => {
      // Reset all of the user's timeslots.
      await prisma.timeSlot.deleteMany({
        where: {
          user_id: input.id,
        },
      })

      // Create the new timeslots.
      const timeslots = await prisma.$transaction(
        input.events.map((event) =>
          prisma.timeSlot.create({
            data: {
              user_id: input.id,
              reservation_id: input.reservationId,
              start: event.start,
              end: event.end,
            },
          }),
        ),
      )

      return timeslots
    }),
})
