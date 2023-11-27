import { type } from 'arktype'

import { router, procedure } from '../init'

import { prisma } from '$lib/server/db'

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
})
